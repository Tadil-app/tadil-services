import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { PAYOUT_STATUS } from '../wallet.model';
import { WalletRepository } from '../wallet.repository';

export class RejectPayoutUseCase {
  constructor(private readonly _walletRepository: WalletRepository) {}

  async execute(payoutRequestId: string): Promise<void> {
    const request = await this._walletRepository.getPayoutRequestById(payoutRequestId);

    if (!request) {
      throw new InvalidCommandException('Payout request not found');
    }

    if (request.status !== PAYOUT_STATUS.PENDING) {
      throw new InvalidCommandException('Payout request is already processed');
    }

    try {
      await this._walletRepository.updatePayoutRequest({
        ...request,
        status: PAYOUT_STATUS.REJECTED,
      });
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
