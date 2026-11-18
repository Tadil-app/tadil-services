import { CourierRepository } from '@tadil-courier';
import { DbClient } from '../../dbClient';
import { OrderStatus, Prisma } from '@prisma/client';

export class PrismaCourierRepository implements CourierRepository {
  constructor(private readonly _db: DbClient) {}

  async acceptAssignment(courierId: string, orderId: string, isReturn: boolean): Promise<boolean> {
    // One conditional write: of two drivers accepting at once, only one wins.
    const where: Prisma.OrderWhereInput = isReturn
      ? {
          id: orderId,
          status: OrderStatus.waitingForReturnCourierAssignement,
          assignedReturnCourierId: null,
          rejectedReturnCouriers: { none: { id: courierId } },
        }
      : {
          id: orderId,
          status: OrderStatus.waitingForCourierAssignement,
          assignedCourierId: null,
          rejectedCouriers: { none: { id: courierId } },
        };
    const nextStatus = isReturn
      ? OrderStatus.waitingForPickupFromTailor
      : OrderStatus.waitingForPickupFromCustomer;

    return this._db.$transaction(async (db) => {
      const result = await db.order.updateMany({
        where,
        data: {
          status: nextStatus,
          [isReturn ? 'assignedReturnCourierId' : 'assignedCourierId']: courierId,
        },
      });
      if (result.count === 0) return false;

      await db.orderStatusHistory.create({ data: { orderId, status: nextStatus } });
      return true;
    });
  }

  async declineAssignment(courierId: string, orderId: string, isReturn: boolean): Promise<void> {
    await this._db.order.update({
      where: { id: orderId },
      data: {
        [isReturn ? 'rejectedReturnCouriers' : 'rejectedCouriers']: {
          connect: [{ id: courierId }],
        },
      },
    });
  }

  async confirmPickup(courierId: string, orderId: string): Promise<boolean> {
    return this._db.$transaction(async (db) => {
      // From the customer, by the first driver.
      const outbound = await db.order.updateMany({
        where: {
          id: orderId,
          assignedCourierId: courierId,
          status: OrderStatus.waitingForPickupFromCustomer,
        },
        data: { status: OrderStatus.waitingForDropoffToTailor },
      });
      if (outbound.count > 0) {
        await db.orderStatusHistory.create({
          data: { orderId, status: OrderStatus.waitingForDropoffToTailor },
        });
        return true;
      }

      // From the tailor, by the return driver.
      const inbound = await db.order.updateMany({
        where: {
          id: orderId,
          assignedReturnCourierId: courierId,
          status: OrderStatus.waitingForPickupFromTailor,
        },
        data: { status: OrderStatus.waitingForDropoffToCustomer },
      });
      if (inbound.count > 0) {
        await db.orderStatusHistory.create({
          data: { orderId, status: OrderStatus.waitingForDropoffToCustomer },
        });
        return true;
      }

      return false;
    });
  }

  async markAsDelivered(courierId: string, orderId: string): Promise<boolean> {
    // The status changes when the recipient confirms receipt. This only checks
    // that the caller is the driver carrying the order.
    const order = await this._db.order.findFirst({
      where: {
        id: orderId,
        OR: [
          { assignedCourierId: courierId, status: OrderStatus.waitingForDropoffToTailor },
          { assignedReturnCourierId: courierId, status: OrderStatus.waitingForDropoffToCustomer },
        ],
      },
      select: { id: true },
    });
    if (!order) return false;

    console.log(`Courier marked order ${orderId} as delivered. Waiting for recipient confirmation.`);
    return true;
  }
}
