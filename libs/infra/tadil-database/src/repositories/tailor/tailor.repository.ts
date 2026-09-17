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

  async confirmReceipt(tailorId: string, orderId: string): Promise<boolean> {
    return this._db.$transaction(async (db) => {
      const result = await db.order.updateMany({
        where: {
          id: orderId,
          assignedTailorId: tailorId,
          status: OrderStatus.waitingForDropoffToTailor,
        },
        data: { status: OrderStatus.inProgress },
      });

      if (result.count === 0) return false;

      await db.orderStatusHistory.create({
        data: { orderId, status: OrderStatus.inProgress },
      });
      return true;
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
