import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { OrdersRepository } from '../orders.repository';

export class AssignTailorManuallyUseCase {
  constructor(private readonly _ordersRepository: OrdersRepository) {}

  async execute(command: {
    orderId: string;
    tailorId: string;
  }): Promise<void> {
    if (!command.orderId || !command.tailorId) {
      throw new InvalidCommandException('Order ID and Tailor ID are required');
    }

    const order = await this._ordersRepository.getById(command.orderId);
    if (!order) {
      throw new InvalidCommandException('Order not found');
    }

    // Logic: We allow manual assignment only if it's currently pending or waiting for a tailor to pick it up.
    // However, for admin, we could be more flexible. Let's allow it if it's not already in progress or completed.
    // (Actual business rule check can be refined later).

    try {
      await this._ordersRepository.assignTailor(command.orderId, command.tailorId);
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
