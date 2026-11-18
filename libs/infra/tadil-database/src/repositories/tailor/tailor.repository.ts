import { TailorRepository } from '@tadil-tailor';
import { DbClient } from '../../dbClient';
import { OrderStatus, Prisma } from '@prisma/client';

export class PrismaTailorRepository implements TailorRepository {
  constructor(private readonly _db: DbClient) {}

  async acceptOrder(tailorId: string, orderId: string): Promise<boolean> {
    // One conditional write: of two tailors accepting at once, only one wins.
    return this._transition(
      orderId,
      {
        status: OrderStatus.waitingForTailorAssignement,
        assignedTailorId: null,
        rejectedTailors: { none: { id: tailorId } },
      },
      OrderStatus.waitingForCourierAssignement,
      { assignedTailorId: tailorId }
    );
  }

  async declineOrder(tailorId: string, orderId: string): Promise<void> {
    await this._db.order.update({
      where: {
        id: orderId,
      },
      data: {
        rejectedTailors: {
          connect: [{ id: tailorId }],
        },
      },
    });
  }

  async confirmReceipt(tailorId: string, orderId: string): Promise<boolean> {
    return this._transition(
      orderId,
      {
        assignedTailorId: tailorId,
        status: OrderStatus.waitingForDropoffToTailor,
      },
      OrderStatus.inProgress
    );
  }

  async markReady(tailorId: string, orderId: string): Promise<boolean> {
    return this._transition(
      orderId,
      {
        assignedTailorId: tailorId,
        status: OrderStatus.inProgress,
      },
      OrderStatus.waitingForReturnCourierAssignement
    );
  }

  /** Moves the order to `status` only if it still matches `where`. */
  private async _transition(
    orderId: string,
    where: Prisma.OrderWhereInput,
    status: OrderStatus,
    data: { assignedTailorId?: string } = {}
  ): Promise<boolean> {
    return this._db.$transaction(async (db) => {
      const result = await db.order.updateMany({
        where: { ...where, id: orderId },
        data: { ...data, status },
      });
      if (result.count === 0) return false;

      await db.orderStatusHistory.create({
        data: { orderId, status },
      });
      return true;
    });
  }
}
