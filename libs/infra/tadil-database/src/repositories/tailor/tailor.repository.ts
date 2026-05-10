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
        status: OrderStatus.waitingForCourierAssignement,
        assignedTailorId: tailorId,
        history: {
          create: {
            status: OrderStatus.waitingForCourierAssignement,
          },
        },
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

  async confirmReceipt(orderId: string): Promise<void> {
    await this._db.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.inProgress,
        history: {
          create: {
            status: OrderStatus.inProgress,
          },
        },
      },
    });
  }

  async markReady(orderId: string): Promise<void> {
    await this._db.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.waitingForReturnCourierAssignement,
        history: {
          create: {
            status: OrderStatus.waitingForReturnCourierAssignement,
          },
        },
      },
    });
  }
}
