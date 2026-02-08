import { InvalidCommandException } from '@tadil-common';
import { TailorRepository } from '../tailor.repository';
export class DeclineOrderUseCase {
  private readonly _tailorRepository: TailorRepository;
  constructor(tailorRepository: TailorRepository) {
    this._tailorRepository = tailorRepository;
  }

  execute(command: DeclineOrderCommand) {
    if (!command.tailorId) {
      throw new InvalidCommandException('Tailor Id should be provided');
    }
    if (!command.orderId) {
      throw new InvalidCommandException('Order Id should be provided');
    }
  }
}

export class DeclineOrderCommand {
  readonly tailorId: string;
  readonly orderId: string;

  constructor(tailorId: string, orderId: string) {
    this.tailorId = tailorId;
    this.orderId = orderId;
  }
}
