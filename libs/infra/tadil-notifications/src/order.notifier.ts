import { DbClient } from '@tadil-database';
import { isDeletedAccountPhone } from '@tadil-users';
import { servesArea, type ServiceArea } from './area';
import { orderPushText, type OrderPushEvent } from './messages';
import type { PushSender } from './push.sender';

export interface OrderSnapshot {
  status: string;
  assignedTailorId: string | null;
  address: ServiceArea | null;
  rejectedTailorIds: string[];
  rejectedCourierIds: string[];
  rejectedReturnCourierIds: string[];
}

export type PushTarget =
  /** One known person (the tailor an admin picked). */
  | { event: OrderPushEvent; userId: string }
  /** Everyone of `role` whose area covers the order, minus `exclude`. */
  | { event: OrderPushEvent; role: 'tailor' | 'courier'; exclude: string[] };

/**
 * Who hears about an order that just entered `order.status`. Only statuses
 * that hand the order to someone new announce anything; `actorId` (the person
 * who caused the change) is never told about their own action.
 */
export function planOrderPush(order: OrderSnapshot, actorId?: string): PushTarget[] {
  switch (order.status) {
    case 'waitingForTailorAssignement':
      return [{ event: 'tailor.orderAvailable', role: 'tailor', exclude: order.rejectedTailorIds }];

    case 'waitingForCourierAssignement': {
      const targets: PushTarget[] = [];
      // Reached by an admin assigning a tailor, or by a tailor accepting from
      // the pool. Only the first needs to tell the tailor.
      if (order.assignedTailorId && order.assignedTailorId !== actorId) {
        targets.push({ event: 'tailor.orderAssigned', userId: order.assignedTailorId });
      }
      targets.push({ event: 'courier.pickupAvailable', role: 'courier', exclude: order.rejectedCourierIds });
      return targets;
    }

    case 'waitingForReturnCourierAssignement':
      return [{ event: 'courier.returnAvailable', role: 'courier', exclude: order.rejectedReturnCourierIds }];

    default:
      return [];
  }
}

interface Recipient {
  userId: string;
  tokens: { token: string; locale: string }[];
}

export class OrderNotifier {
  constructor(
    private readonly _db: DbClient,
    private readonly _sender: PushSender
  ) {}

  /**
   * Announces the order's current status in the background. Never throws and
   * never delays the request that changed the order: a failed push must not
   * fail an accepted payment or assignment.
   */
  orderStatusChanged(orderId: string, actorId?: string): void {
    void this.dispatch(orderId, actorId).catch((error) =>
      console.error(`[push] Failed to notify for order ${orderId}`, error)
    );
  }

  /** Sends the alerts for the order's latest status change; returns how many devices were targeted. */
  async dispatch(orderId: string, actorId?: string): Promise<number> {
    const order = await this._db.order.findUnique({
      where: { id: orderId },
      select: {
        reference: true,
        status: true,
        assignedTailorId: true,
        address: { select: { cityId: true, cityNameEn: true, districtId: true, districtNameEn: true } },
        rejectedTailors: { select: { id: true } },
        rejectedCouriers: { select: { id: true } },
        rejectedReturnCouriers: { select: { id: true } },
        history: { orderBy: { timestamp: 'desc' }, take: 1, select: { id: true, status: true } },
      },
    });
    const latest = order?.history[0];
    if (!order || !latest || latest.status !== order.status) return 0;

    const targets = planOrderPush(
      {
        status: order.status,
        assignedTailorId: order.assignedTailorId,
        address: order.address,
        rejectedTailorIds: order.rejectedTailors.map((u) => u.id),
        rejectedCourierIds: order.rejectedCouriers.map((u) => u.id),
        rejectedReturnCourierIds: order.rejectedReturnCouriers.map((u) => u.id),
      },
      actorId
    );
    if (targets.length === 0) return 0;

    // Each status change writes one history row: claiming its id makes the
    // alert go out once, even when the payment confirmation is retried.
    const claim = await this._db.pushDispatch.createMany({
      data: [{ key: `order-status:${latest.id}` }],
      skipDuplicates: true,
    });
    if (claim.count === 0) return 0;

    let targeted = 0;
    for (const target of targets) {
      const recipients =
        'userId' in target
          ? await this._recipientsById([target.userId])
          : await this._recipientsInArea(target.role, order.address, [...target.exclude, ...(actorId ? [actorId] : [])]);
      targeted += await this._send(target.event, order.reference, orderId, recipients);
    }
    return targeted;
  }

  private async _recipientsById(userIds: string[]): Promise<Recipient[]> {
    const users = await this._db.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, phone: true, deviceTokens: { select: { token: true, locale: true } } },
    });
    return users
      .filter((user) => !isDeletedAccountPhone(user.phone))
      .map((user) => ({ userId: user.id, tokens: user.deviceTokens }));
  }

  private async _recipientsInArea(
    role: 'tailor' | 'courier',
    area: ServiceArea | null,
    exclude: string[]
  ): Promise<Recipient[]> {
    if (!area) return [];
    const users = await this._db.user.findMany({
      where: { role, id: { notIn: exclude }, deviceTokens: { some: {} } },
      select: {
        id: true,
        phone: true,
        // The order lists use the user's first address as their area.
        addresses: {
          take: 1,
          select: { cityId: true, cityNameEn: true, districtId: true, districtNameEn: true },
        },
        deviceTokens: { select: { token: true, locale: true } },
      },
    });
    return users
      .filter((user) => !isDeletedAccountPhone(user.phone))
      .filter((user) => user.addresses[0] && servesArea(user.addresses[0], area))
      .map((user) => ({ userId: user.id, tokens: user.deviceTokens }));
  }

  private async _send(
    event: OrderPushEvent,
    reference: string,
    orderId: string,
    recipients: Recipient[]
  ): Promise<number> {
    // One multicast per language, so every phone reads its own.
    const byLocale = new Map<string, string[]>();
    for (const { tokens } of recipients) {
      for (const { token, locale } of tokens) {
        byLocale.set(locale, [...(byLocale.get(locale) ?? []), token]);
      }
    }

    let sent = 0;
    for (const [locale, tokens] of byLocale) {
      const { title, body } = orderPushText(event, locale, reference);
      const dead = await this._sender.send({
        tokens,
        title,
        body,
        data: { type: event, orderId, reference },
      });
      sent += tokens.length;
      if (dead.length > 0) {
        await this._db.deviceToken.deleteMany({ where: { token: { in: dead } } });
      }
    }
    if (sent > 0) {
      console.log(`[push] ${event} for ${reference} sent to ${sent} device(s)`);
    }
    return sent;
  }
}
