import { Provider, Scope } from '@nestjs/common';
import { DbClient, PrismaOrdersRepository } from '@tadil-database';
import { createPushSender, OrderNotifier } from '@tadil-notifications';
import {
  OrdersRepository,
  AssignTailorManuallyUseCase,
} from '@tadil-orders';

const OrdersRepositoryProvider: Provider<OrdersRepository> = {
  provide: 'OrdersRepository',
  useFactory: (dbClient: DbClient) => {
    return new PrismaOrdersRepository(dbClient);
  },
  scope: Scope.REQUEST,
  inject: [DbClient],
};

const AssignTailorManuallyUseCaseProvider: Provider<AssignTailorManuallyUseCase> = {
  provide: AssignTailorManuallyUseCase,
  useFactory: (ordersRepository: OrdersRepository) => {
    return new AssignTailorManuallyUseCase(ordersRepository);
  },
  scope: Scope.REQUEST,
  inject: ['OrdersRepository'],
};

// One sender per process: Firebase is initialised once.
const OrderNotifierProvider: Provider<OrderNotifier> = {
  provide: OrderNotifier,
  useFactory: (dbClient: DbClient) => new OrderNotifier(dbClient, createPushSender()),
  inject: [DbClient],
};

export {
  OrderNotifierProvider,
  OrdersRepositoryProvider,
  AssignTailorManuallyUseCaseProvider,
};
