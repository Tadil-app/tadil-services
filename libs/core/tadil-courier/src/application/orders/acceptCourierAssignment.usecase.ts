import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { CourierRepository } from '../courier.repository';

export class AcceptCourierAssignmentUseCase {
  constructor(private readonly _courierRepository: CourierRepository) {}

  /** False when the trip is no longer open to this driver. */
  async execute(command: { courierId: string; orderId: string; isReturn: boolean }): Promise<boolean> {
    if (!command.courierId || !command.orderId) {
      throw new InvalidCommandException('Courier ID and Order ID are required');
    }

    try {
      return await this._courierRepository.acceptAssignment(
        command.courierId,
        command.orderId,
        command.isReturn
      );
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
