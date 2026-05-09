import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { PAYOUT_STATUS, TRANSACTION_TYPE, Transaction } from '../wallet.model';
import { WalletRepository } from '../wallet.repository';
import { v4 as uuid } from 'uuid';

export class FulfillPayoutUseCase {
  constructor(private readonly _walletRepository: WalletRepository) {}

  async execute(payoutRequestId: string): Promise<void> {
    const request = await this._walletRepository.getPayoutRequestById(payoutRequestId);

    if (!request) {
      throw new InvalidCommandException('Payout request not found');
    }

    if (request.status !== PAYOUT_STATUS.PENDING) {
      throw new InvalidCommandException('Payout request is already processed');
    }

    const wallet = await this._walletRepository.getWalletDetails(request.userId);

    if (wallet.balance < request.amount) {
      throw new InvalidCommandException('User no longer has sufficient balance');
    }

    try {
      // 1. Deduct balance
      const newBalance = wallet.balance - request.amount;
      await this._walletRepository.updateUserBalance(request.userId, newBalance);

      // 2. Create payout transaction
      const transaction: Transaction = {
        id: uuid(),
        reference: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: request.amount,
        type: TRANSACTION_TYPE.PAYOUT,
        date: new Date().toISOString(),
        userId: request.userId,
      };
      await this._walletRepository.createTransaction(transaction);

      // 3. Update request status
      await this._walletRepository.updatePayoutRequest({
        ...request,
        status: PAYOUT_STATUS.FULFILLED,
      });
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
