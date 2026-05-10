import { CourierRepository } from '@tadil-courier';
import { DbClient } from '../../dbClient';
import { OrderStatus } from '@prisma/client';

export class PrismaCourierRepository implements CourierRepository {
  constructor(private readonly _db: DbClient) {}

  async acceptAssignment(courierId: string, orderId: string, isReturn: boolean): Promise<void> {
    const nextStatus = isReturn 
      ? OrderStatus.waitingForPickupFromTailor 
      : OrderStatus.waitingForPickupFromCustomer;

    await this._db.order.update({
      where: { id: orderId },
      data: {
        status: nextStatus,
        [isReturn ? 'assignedReturnCourierId' : 'assignedCourierId']: courierId,
        history: {
          create: {
            status: nextStatus,
          },
        },
      },
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

  async confirmPickup(orderId: string): Promise<void> {
    const order = await this._db.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });

    if (!order) return;

    let nextStatus: OrderStatus = order.status;
    if (order.status === OrderStatus.waitingForPickupFromCustomer) {
      nextStatus = OrderStatus.waitingForDropoffToTailor;
    } else if (order.status === OrderStatus.waitingForPickupFromTailor) {
      nextStatus = OrderStatus.waitingForDropoffToCustomer;
    }

    await this._db.order.update({
      where: { id: orderId },
      data: {
        status: nextStatus,
        history: {
          create: {
            status: nextStatus,
          },
        },
      },
    });
  }

  async markAsDelivered(orderId: string): Promise<void> {
    // For now, this just flags it in the logs or eventually sends a notification.
    // The status transition happens when the recipient confirms receipt.
    console.log(`Courier marked order ${orderId} as delivered. Waiting for recipient confirmation.`);
  }
}
