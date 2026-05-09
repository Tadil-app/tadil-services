import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { PAYOUT_STATUS, PayoutRequest } from '../wallet.model';
import { WalletRepository } from '../wallet.repository';
import { v4 as uuid } from 'uuid';

export class RequestPayoutUseCase {
  constructor(private readonly _walletRepository: WalletRepository) {}

  async execute(command: { userId: string; amount: number }): Promise<void> {
    if (!command.userId || !command.amount || command.amount <= 0) {
      throw new InvalidCommandException('Valid User ID and positive amount are required');
    }

    const wallet = await this._walletRepository.getWalletDetails(command.userId);

    if (wallet.balance < command.amount) {
      throw new InvalidCommandException('Insufficient balance');
    }

    try {
      const request: PayoutRequest = {
        id: uuid(),
        userId: command.userId,
        amount: command.amount,
        status: PAYOUT_STATUS.PENDING,
        date: new Date().toISOString(),
      };
      await this._walletRepository.createPayoutRequest(request);
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
