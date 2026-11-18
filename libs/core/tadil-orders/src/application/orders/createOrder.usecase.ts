import {
  InfrastructureException,
  InvalidCommandException,
  Order,
  ORDER_STATUS,
  PlatformSettings,
  transportationFee,
} from '@tadil-common';
import { OrdersRepository } from '../orders.repository';
import { v4 as uuid } from 'uuid';

export class CreateOrderUseCase {
  constructor(private readonly _ordersRepository: OrdersRepository) {}

  async execute(command: {
    customerId: string;
    addressId: string;
    items: any[]; // Simplified for now, should match ModelItems
    customItems: any[];
    settings: PlatformSettings;
  }): Promise<Order> {
    if (!command.customerId || !command.addressId) {
      throw new InvalidCommandException('Customer ID and Address ID are required');
    }

    // Calculate total price
    let totalPrice = 0;
    command.items.forEach((item) => {
      totalPrice += item.price;
    });
    command.customItems.forEach((item) => {
      totalPrice += item.price;
    });

    const deliveryFee = transportationFee(totalPrice, command.settings);

    const order: Order = {
      id: uuid(),
      customerId: command.customerId,
      addressId: command.addressId,
      reference: `TAD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      totalPrice: totalPrice + deliveryFee,
      deliveryFee,
      status: ORDER_STATUS.PENDING,
      items: command.items,
      customItems: command.customItems,
    };

    try {
      await this._ordersRepository.create(order);
      return order;
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
