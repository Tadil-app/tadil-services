import {
  InfrastructureException,
  InvalidCommandException,
  ORDER_STATUS,
} from '@tadil-common';
import { OrdersRepository } from '../orders.repository';

export class ConfirmPaymentUseCase {
  constructor(private readonly _ordersRepository: OrdersRepository) {}

  async execute(command: {
    orderId: string;
    paymentId: string;
  }): Promise<void> {
    if (!command.orderId || !command.paymentId) {
      throw new InvalidCommandException('Order ID and Payment ID are required');
    }

    try {
      // Transition from PENDING to WAITING_FOR_TAILOR_ASSIGNMENT
      await this._ordersRepository.updateStatus(
        command.orderId,
        ORDER_STATUS.WAITING_FOR_TAILOR_ASSIGNMENT
      );
      
      // In the future, we would also save the paymentId and maybe verify it with Moyasar here.
      console.log(`Payment ${command.paymentId} confirmed for order ${command.orderId}`);
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
