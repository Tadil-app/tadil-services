import { PayoutRequest, Transaction, WalletDetails } from './wallet.model';

export interface WalletRepository {
  getWalletDetails(userId: string): Promise<WalletDetails>;
  createTransaction(transaction: Transaction): Promise<void>;
  createPayoutRequest(request: PayoutRequest): Promise<void>;
  getPayoutRequestById(id: string): Promise<PayoutRequest | undefined>;
  updatePayoutRequest(request: PayoutRequest): Promise<void>;
  updateUserBalance(userId: string, newBalance: number): Promise<void>;
  getPendingPayoutRequests(): Promise<PayoutRequest[]>;
}
