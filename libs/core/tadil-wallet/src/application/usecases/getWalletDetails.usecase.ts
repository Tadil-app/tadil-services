import { WalletDetails } from '../wallet.model';
import { WalletRepository } from '../wallet.repository';

export class GetWalletDetailsUseCase {
  constructor(private readonly _walletRepository: WalletRepository) {}

  async execute(userId: string): Promise<WalletDetails> {
    return this._walletRepository.getWalletDetails(userId);
  }
}
