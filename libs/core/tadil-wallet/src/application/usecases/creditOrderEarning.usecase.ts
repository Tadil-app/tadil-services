import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { TRANSACTION_TYPE, Transaction } from '../wallet.model';
import { WalletRepository } from '../wallet.repository';
import { v4 as uuid } from 'uuid';

export class CreditOrderEarningUseCase {
  constructor(private readonly _walletRepository: WalletRepository) {}

  async execute(command: {
    userId: string;
    orderId: string;
    orderTotal: number;
    commissionRate: number; // Percentage, e.g., 10 for 10%
  }): Promise<void> {
    if (!command.userId || !command.orderId || command.orderTotal <= 0) {
      throw new InvalidCommandException('Valid User ID, Order ID and positive total are required');
    }

    const earningAmount = (command.orderTotal * command.commissionRate) / 100;

    try {
      const wallet = await this._walletRepository.getWalletDetails(command.userId);
      const newBalance = wallet.balance + earningAmount;

      await this._walletRepository.updateUserBalance(command.userId, newBalance);

      const transaction: Transaction = {
        id: uuid(),
        reference: `ERN-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: earningAmount,
        type: TRANSACTION_TYPE.EARNING,
        date: new Date().toISOString(),
        userId: command.userId,
        orderId: command.orderId,
      };

      await this._walletRepository.createTransaction(transaction);
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
