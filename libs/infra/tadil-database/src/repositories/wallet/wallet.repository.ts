import { PayoutRequest, Transaction, WalletDetails, WalletRepository } from '@tadil-wallet';
import { DbClient } from '../../dbClient';
import { PayoutStatus, TransactionType } from '@prisma/client';

export class PrismaWalletRepository implements WalletRepository {
  constructor(private readonly _db: DbClient) {}

  async getWalletDetails(userId: string): Promise<WalletDetails> {
    const user = await this._db.user.findUnique({
      where: { id: userId },
      include: {
        transactions: { orderBy: { date: 'desc' } },
        payoutRequests: { orderBy: { date: 'desc' } },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      balance: user.walletBalance,
      transactions: user.transactions.map((t) => ({
        ...t,
        type: t.type as any,
        date: t.date.toISOString(),
        orderId: t.orderId ?? undefined,
      })),
      payoutRequests: user.payoutRequests.map((r) => ({
        ...r,
        status: r.status as any,
        date: r.date.toISOString(),
      })),
    };
  }

  async createTransaction(transaction: Transaction): Promise<void> {
    await this._db.transaction.create({
      data: {
        id: transaction.id,
        reference: transaction.reference,
        amount: transaction.amount,
        type: transaction.type as TransactionType,
        date: new Date(transaction.date),
        userId: transaction.userId,
        orderId: transaction.orderId,
      },
    });
  }

  async createPayoutRequest(request: PayoutRequest): Promise<void> {
    await this._db.payoutRequest.create({
      data: {
        id: request.id,
        amount: request.amount,
        status: request.status as PayoutStatus,
        date: new Date(request.date),
        userId: request.userId,
      },
    });
  }

  async getPayoutRequestById(id: string): Promise<PayoutRequest | undefined> {
    const r = await this._db.payoutRequest.findUnique({
      where: { id },
    });
    if (!r) return undefined;
    return {
      ...r,
      status: r.status as any,
      date: r.date.toISOString(),
    };
  }

  async updatePayoutRequest(request: PayoutRequest): Promise<void> {
    await this._db.payoutRequest.update({
      where: { id: request.id },
      data: {
        status: request.status as PayoutStatus,
      },
    });
  }

  async updateUserBalance(userId: string, newBalance: number): Promise<void> {
    await this._db.user.update({
      where: { id: userId },
      data: {
        walletBalance: newBalance,
      },
    });
  }

  async getPendingPayoutRequests(): Promise<PayoutRequest[]> {
    const requests = await this._db.payoutRequest.findMany({
      where: { status: PayoutStatus.PENDING },
      orderBy: { date: 'desc' },
    });
    return requests.map((r) => ({
      ...r,
      status: r.status as any,
      date: r.date.toISOString(),
    }));
  }
}
