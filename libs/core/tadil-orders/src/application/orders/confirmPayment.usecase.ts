import {
  InfrastructureException,
  InvalidCommandException,
  ORDER_STATUS,
} from '@tadil-common';
import { OrdersRepository } from '../orders.repository';
import { PaymentGateway } from '../payment.gateway';

export interface ConfirmPaymentResult {
  orderId: string;
  reference: string;
}

export class ConfirmPaymentUseCase {
  constructor(
    private readonly _ordersRepository: OrdersRepository,
    private readonly _paymentGateway: PaymentGateway
  ) {}

  /**
   * Moves a PENDING order to WAITING_FOR_TAILOR_ASSIGNMENT once Moyasar
   * reports the payment as paid for the right amount.
   *
   * `orderId` is optional: the payment carries `metadata.order_id`, so a
   * device that lost its local state can still claim the order it paid for.
   * Confirming an already confirmed order is a no-op, which lets the client
   * retry safely.
   */
  async execute(command: {
    paymentId: string;
    customerId: string;
    orderId?: string;
  }): Promise<ConfirmPaymentResult> {
    if (!command.paymentId || !command.customerId) {
      throw new InvalidCommandException('Payment ID and customer are required');
    }

    let payment;
    try {
      payment = await this._paymentGateway.getPayment(command.paymentId);
    } catch (error) {
      throw new InfrastructureException(
        error instanceof Error ? error.message : 'Payment provider unavailable'
      );
    }
    if (!payment) {
      throw new InvalidCommandException(`Payment ${command.paymentId} not found`);
    }

    const orderId = command.orderId || payment.metadata?.order_id;
    if (!orderId) {
      throw new InvalidCommandException('Payment is not linked to an order');
    }
    if (command.orderId && payment.metadata?.order_id && payment.metadata.order_id !== command.orderId) {
      throw new InvalidCommandException('Payment does not belong to this order');
    }

    const order = await this._ordersRepository.getById(orderId);
    if (!order || order.customerId !== command.customerId) {
      throw new InvalidCommandException(`Order ${orderId} not found`);
    }

    if (order.status !== ORDER_STATUS.PENDING) {
      // Already confirmed (e.g. by a previous call or a reconcile). Idempotent.
      return { orderId: order.id, reference: order.reference };
    }

    const expectedHalalas = Math.round(order.totalPrice * 100);
    if (payment.status !== 'paid' || payment.amount !== expectedHalalas) {
      console.warn(
        `Payment verification failed: status=${payment.status}, amount=${payment.amount}, expected=${expectedHalalas}`
      );
      throw new InvalidCommandException('Payment verification failed');
    }

    try {
      await this._ordersRepository.updateStatus(
        order.id,
        ORDER_STATUS.WAITING_FOR_TAILOR_ASSIGNMENT
      );
    } catch (error) {
      throw new InfrastructureException(
        error instanceof Error ? error.message : 'Failed to update order'
      );
    }

    console.log(`Payment ${command.paymentId} confirmed for order ${order.id}`);
    return { orderId: order.id, reference: order.reference };
  }
}
