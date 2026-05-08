import { CustomerRepository } from '@tadil-customer';
import { DbClient } from '../../dbClient';
import { OrderStatus } from '@prisma/client';

export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private readonly _db: DbClient) {}

  async confirmReceipt(orderId: string): Promise<void> {
    await this._db.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.done },
    });
  }
}
