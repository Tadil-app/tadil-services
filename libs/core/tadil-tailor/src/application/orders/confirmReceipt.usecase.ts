import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { TailorRepository } from '../tailor.repository';

export class ConfirmReceiptUseCase {
  constructor(private readonly _tailorRepository: TailorRepository) {}

  async execute(command: { tailorId: string; orderId: string }) {
    if (!command.tailorId) {
      throw new InvalidCommandException('Tailor ID is required');
    }
    if (!command.orderId) {
      throw new InvalidCommandException('Order ID is required');
    }

    try {
      return await this._tailorRepository.confirmReceipt(
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
