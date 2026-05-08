import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { TailorRepository } from '../tailor.repository';

export class MarkOrderReadyUseCase {
  constructor(private readonly _tailorRepository: TailorRepository) {}

  async execute(command: { orderId: string }) {
    if (!command.orderId) {
      throw new InvalidCommandException('Order ID is required');
    }

    try {
      await this._tailorRepository.markReady(command.orderId);
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
