import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { TailorRepository } from '../tailor.repository';

export class MarkOrderReadyUseCase {
  constructor(private readonly _tailorRepository: TailorRepository) {}

  /** False unless the order is in progress with this tailor. */
  async execute(command: { tailorId: string; orderId: string }): Promise<boolean> {
    if (!command.tailorId) {
      throw new InvalidCommandException('Tailor ID is required');
    }
    if (!command.orderId) {
      throw new InvalidCommandException('Order ID is required');
    }

    try {
      return await this._tailorRepository.markReady(
        command.tailorId,
        command.orderId
      );
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
