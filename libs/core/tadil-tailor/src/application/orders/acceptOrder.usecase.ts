import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { TailorRepository } from '../tailor.repository';
export class AcceptOrderUseCase {
  private readonly _tailorRepository: TailorRepository;
  constructor(tailorRepository: TailorRepository) {
    this._tailorRepository = tailorRepository;
  }

  /** False when the order is no longer open to this tailor. */
  async execute(command: AcceptOrderCommand): Promise<boolean> {
    if (!command.tailorId) {
      throw new InvalidCommandException('Tailor Id should be provided');
    }
    if (!command.orderId) {
      throw new InvalidCommandException('Order Id should be provided');
    }

    try {
      return await this._tailorRepository.acceptOrder(
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

export class AcceptOrderCommand {
  readonly tailorId: string;
  readonly orderId: string;

  constructor(tailorId: string, orderId: string) {
    this.tailorId = tailorId;
    this.orderId = orderId;
  }
}
