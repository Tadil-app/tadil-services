import {
  InfrastructureException,
  InvalidCommandException,
  ORDER_STATUS,
} from '@tadil-common';
import { OrdersRepository } from '../orders.repository';
import { PaymentGateway } from '../payment.gateway';

export class ConfirmPaymentUseCase {
  constructor(
    private readonly _ordersRepository: OrdersRepository,
    private readonly _paymentGateway: PaymentGateway
  ) {}

  async execute(command: {
    orderId: string;
    paymentId: string;
  }): Promise<void> {
    if (!command.orderId || !command.paymentId) {
      throw new InvalidCommandException('Order ID and Payment ID are required');
    }

    try {
      const order = await this._ordersRepository.getById(command.orderId);
      if (!order) {
        throw new InvalidCommandException(`Order with ID ${command.orderId} not found`);
      }

      if (order.status !== ORDER_STATUS.PENDING) {
        throw new InvalidCommandException(`Order ${command.orderId} is not in PENDING status`);
      }

      const isVerified = await this._paymentGateway.verifyPayment(command.paymentId, order.totalPrice);
      if (!isVerified) {
        throw new InvalidCommandException('Payment verification failed');
      }

      // Transition from PENDING to WAITING_FOR_TAILOR_ASSIGNMENT
      await this._ordersRepository.updateStatus(
        command.orderId,
        ORDER_STATUS.WAITING_FOR_TAILOR_ASSIGNMENT
      );
      
      console.log(`Payment ${command.paymentId} confirmed for order ${command.orderId}`);
    } catch (error) {
      if (error instanceof InvalidCommandException) {
        throw error;
      }
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
