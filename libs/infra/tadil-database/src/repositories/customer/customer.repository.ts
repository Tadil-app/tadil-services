import { CustomerRepository } from '@tadil-customer';
import { DbClient } from '../../dbClient';
import { OrderStatus } from '@prisma/client';

export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private readonly _db: DbClient) {}

  async confirmReceipt(customerId: string, orderId: string): Promise<boolean> {
    return this._db.$transaction(async (db) => {
      const result = await db.order.updateMany({
        where: {
          id: orderId,
          customerId,
          status: OrderStatus.waitingForDropoffToCustomer,
        },
        data: { status: OrderStatus.done },
      });
      if (result.count === 0) return false;

      await db.orderStatusHistory.create({
        data: { orderId, status: OrderStatus.done },
      });
      return true;
    });
  }
}
