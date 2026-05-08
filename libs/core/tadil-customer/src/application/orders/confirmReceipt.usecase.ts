import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { CustomerRepository } from '../customer.repository';

export class ConfirmReceiptUseCase {
  constructor(private readonly _customerRepository: CustomerRepository) {}

  async execute(command: { orderId: string }) {
    if (!command.orderId) {
      throw new InvalidCommandException('Order ID is required');
    }

    try {
      await this._customerRepository.confirmReceipt(command.orderId);
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
