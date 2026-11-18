import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { CourierRepository } from '../courier.repository';

export class ConfirmPickupUseCase {
  constructor(private readonly _courierRepository: CourierRepository) {}

  /** False unless this driver is on the order's current leg. */
  async execute(command: { courierId: string; orderId: string }): Promise<boolean> {
    if (!command.courierId || !command.orderId) {
      throw new InvalidCommandException('Courier ID and Order ID are required');
    }

    try {
      return await this._courierRepository.confirmPickup(
        command.courierId,
        command.orderId
      );
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
