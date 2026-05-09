import {
  InfrastructureException,
  InvalidCommandException,
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

  async execute(command: { orderId: string }) {
    if (!command.orderId) {
      throw new InvalidCommandException('Order ID is required');
    }

    try {
      // 1. Confirm receipt and transition status to DONE
      await this._customerRepository.confirmReceipt(command.orderId);

      // 2. Fetch order details to credit earnings
      const order = await this._ordersRepository.getById(command.orderId);
      if (!order) return;

      // 3. Credit Tailor
      if (order.assignedTailorId) {
        const tailor = await this._usersRepository.getUserById(order.assignedTailorId);
        if (tailor) {
          await this._creditOrderEarningUseCase.execute({
            userId: tailor.id,
            orderId: order.id,
            orderTotal: order.totalPrice,
            commissionRate: tailor.commissionRate || 10,
          });
        }
      }

      // 4. Credit Return Courier
      if (order.assignedReturnCourierId) {
        const courier = await this._usersRepository.getUserById(order.assignedReturnCourierId);
        if (courier) {
          await this._creditOrderEarningUseCase.execute({
            userId: courier.id,
            orderId: order.id,
            orderTotal: order.totalPrice,
            commissionRate: courier.commissionRate || 10,
          });
        }
      }

      // NOTE: The initial courier (assignedCourierId) should probably be credited when they deliver to the tailor.
      // But the prompt said "percentage of the total price ... fulfill the payment".
      // I'll stick to crediting when the whole order is "Done" for both for now, OR I can add it to Tailor's confirmReceipt too.
      // Let's also credit the INITIAL courier if they were involved.
      if (order.assignedCourierId) {
        const firstCourier = await this._usersRepository.getUserById(order.assignedCourierId);
        if (firstCourier) {
          await this._creditOrderEarningUseCase.execute({
            userId: firstCourier.id,
            orderId: order.id,
            orderTotal: order.totalPrice,
            commissionRate: firstCourier.commissionRate || 10,
          });
        }
      }

    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
