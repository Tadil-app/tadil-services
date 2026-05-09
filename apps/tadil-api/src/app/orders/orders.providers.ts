import { Provider, Scope } from '@nestjs/common';
import { DbClient, PrismaOrdersRepository } from '@tadil-database';
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

export {
  OrdersRepositoryProvider,
  AssignTailorManuallyUseCaseProvider,
};
