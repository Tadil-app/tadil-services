import { InfrastructureException, ORDER_STATUS } from '@tadil-common';
import { OrdersRepository } from '../orders.repository';
import { PaymentGateway, PaymentRecord } from '../payment.gateway';

/**
 * - confirmed: the order is placed (a settled payment of the right amount exists,
 *   or it had already left PENDING).
 * - abandoned: no money is involved; the unpaid order was deleted.
 * - pending: money may be involved, so the order was kept. Either a payment is
 *   still being processed (3DS in flight) or a settled payment does not match
 *   the order total and needs a human look.
 * - missing: no such order for this customer.
 */
export type ReconcileOutcome = 'confirmed' | 'abandoned' | 'pending' | 'missing';

// Money has been taken or reserved.
const SETTLED_STATUSES = new Set(['paid', 'captured', 'authorized']);
// The customer may still be in a 3DS challenge.
const IN_FLIGHT_STATUSES = new Set(['initiated']);
// An `initiated` payment older than this was never completed.
const IN_FLIGHT_GRACE_MS = 30 * 60 * 1000;

export class ReconcilePendingOrderUseCase {
  constructor(
    private readonly _ordersRepository: OrdersRepository,
    private readonly _paymentGateway: PaymentGateway,
    private readonly _now: () => number = () => Date.now()
  ) {}

  async execute(command: { orderId: string; customerId: string }): Promise<ReconcileOutcome> {
    if (!command.orderId || !command.customerId) return 'missing';

    const order = await this._ordersRepository.getById(command.orderId);
    if (!order || order.customerId !== command.customerId) return 'missing';
    if (order.status !== ORDER_STATUS.PENDING) return 'confirmed';

    let payments: PaymentRecord[];
    try {
      payments = await this._paymentGateway.findPaymentsForOrder(order.id);
    } catch (error) {
      // Never delete on an outage: the customer may have paid.
      throw new InfrastructureException(
        error instanceof Error ? error.message : 'Payment provider unavailable'
      );
    }

    const expectedHalalas = Math.round(order.totalPrice * 100);
    const settled = payments.filter((p) => SETTLED_STATUSES.has(p.status));

    const match = settled.find((p) => p.amount === expectedHalalas);
    if (match) {
      await this._ordersRepository.updateStatus(
        order.id,
        ORDER_STATUS.WAITING_FOR_TAILOR_ASSIGNMENT
      );
      console.log(`Reconciled order ${order.id} with payment ${match.id}`);
      return 'confirmed';
    }

    if (settled.length > 0) {
      // Money was taken but does not match the order. Keep everything for review.
      console.error(
        `Order ${order.id} has settled payment(s) that do not match its total ${expectedHalalas}:`,
        settled.map((p) => `${p.id}=${p.amount}(${p.status})`).join(', ')
      );
      return 'pending';
    }

    if (payments.some((p) => this._isInFlight(p))) {
      return 'pending';
    }

    await this._ordersRepository.delete(order.id);
    return 'abandoned';
  }

  private _isInFlight(payment: PaymentRecord): boolean {
    if (!IN_FLIGHT_STATUSES.has(payment.status)) return false;
    if (!payment.createdAt) return true;
    const createdAt = Date.parse(payment.createdAt);
    if (Number.isNaN(createdAt)) return true;
    return this._now() - createdAt < IN_FLIGHT_GRACE_MS;
  }
}
