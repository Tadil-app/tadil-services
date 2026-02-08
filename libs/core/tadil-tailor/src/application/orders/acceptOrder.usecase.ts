import { InvalidCommandException } from '@tadil-common';
import { TailorRepository } from '../tailor.repository';
export class AcceptOrderUseCase {
  private readonly _tailorRepository: TailorRepository;
  constructor(tailorRepository: TailorRepository) {
    this._tailorRepository = tailorRepository;
  }

  execute(command: AcceptOrderCommand) {
    if (!command.tailorId) {
      throw new InvalidCommandException('Tailor Id should be provided');
    }
    if (!command.orderId) {
      throw new InvalidCommandException('Order Id should be provided');
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
