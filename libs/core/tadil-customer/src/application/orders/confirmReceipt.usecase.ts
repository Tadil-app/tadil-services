import {
  InfrastructureException,
  InvalidCommandException,
  PlatformSettings,
  tailorPayout,
} from '@tadil-common';
import { CustomerRepository } from '../customer.repository';
import { CreditOrderEarningUseCase } from '@tadil-wallet';
import { OrdersRepository } from '@tadil-orders';
import { UsersRepository } from '@tadil-users';

export class ConfirmReceiptUseCase {
  constructor(
    private readonly _customerRepository: CustomerRepository,
    private readonly _ordersRepository: OrdersRepository,
    private readonly _usersRepository: UsersRepository,
    private readonly _creditOrderEarningUseCase: CreditOrderEarningUseCase
  ) {}

  /**
   * False when the order isn't this customer's or isn't out for delivery to
   * them. Earnings are credited only by the call that closed the order, so a
   * repeated request pays nothing.
   */
  async execute(command: {
    customerId: string;
    orderId: string;
    settings: PlatformSettings;
  }): Promise<boolean> {
    if (!command.customerId || !command.orderId) {
      throw new InvalidCommandException('Customer ID and Order ID are required');
    }

    try {
      // 1. Confirm receipt and transition status to DONE
      const closed = await this._customerRepository.confirmReceipt(
        command.customerId,
        command.orderId
      );
      if (!closed) return false;

      // 2. Fetch order details to credit earnings
      const order = await this._ordersRepository.getById(command.orderId);
      if (!order) return true;

      // 3. Credit the tailor their share of the items, and each driver a
      // fixed payout per trip (the same driver can do both trips).
      const itemsTotal = order.totalPrice - (order.deliveryFee ?? 0);
      if (order.assignedTailorId) {
        const tailor = await this._usersRepository.getUserById(order.assignedTailorId);
        if (tailor) {
          await this._creditOrderEarningUseCase.execute({
            userId: tailor.id,
            orderId: order.id,
            amount: tailorPayout(itemsTotal, tailor.commissionRate, command.settings),
          });
        }
      }

      for (const courierId of [order.assignedCourierId, order.assignedReturnCourierId]) {
        if (!courierId) continue;
        await this._creditOrderEarningUseCase.execute({
          userId: courierId,
          orderId: order.id,
          amount: command.settings.courierBasePayout,
        });
      }

      return true;
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
