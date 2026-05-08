import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { CourierRepository } from '../courier.repository';

export class ConfirmPickupUseCase {
  constructor(private readonly _courierRepository: CourierRepository) {}

  async execute(command: { orderId: string }) {
    if (!command.orderId) {
      throw new InvalidCommandException('Order ID is required');
    }

    try {
      await this._courierRepository.confirmPickup(command.orderId);
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
