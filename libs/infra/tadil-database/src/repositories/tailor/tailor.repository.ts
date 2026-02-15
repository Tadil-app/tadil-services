import { TailorRepository } from '@tadil-tailor';
import { DbClient } from '../../dbClient';
import { OrderStatus } from '@prisma/client';

export class PrismaTailorRepository implements TailorRepository {
  constructor(private readonly _db: DbClient) {}

  async acceptOrder(tailorId: string, orderId: string): Promise<void> {
    await this._db.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: OrderStatus.waitingForPickup,
        assignedTailorId: tailorId,
      },
    });
  }

  async declineOrder(tailorId: string, orderId: string): Promise<void> {
    await this._db.order.update({
      where: {
        id: orderId,
      },
      data: {
        rejectedTailors: {
          connect: [{ id: tailorId }],
        },
      },
    });
  }
}
