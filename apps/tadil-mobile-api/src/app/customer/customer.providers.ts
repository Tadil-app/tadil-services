import { Provider, Scope } from '@nestjs/common';
import {
  DbClient,
  PrismaAlterationsRepository,
  PrismaCustomerRepository,
  PrismaInformationsRepository,
  PrismaModelsRepository,
  PrismaOrdersRepository,
} from '@tadil-database';
import {
  CustomerRepository,
  ConfirmReceiptUseCase,
} from '@tadil-customer';
import { ModelsRepository } from '@tadil-models';
import { AlterationsRepository } from '@tadil-alterations';
import { InformationsRepository } from '@tadil-informations';
import {
  OrdersRepository,
  CreateOrderUseCase,
  ConfirmPaymentUseCase,
} from '@tadil-orders';

const CustomerRepositoryProvider: Provider<CustomerRepository> = {
  provide: 'CustomerRepository',
  useFactory: (dbClient: DbClient) => new PrismaCustomerRepository(dbClient),
  inject: [DbClient],
  scope: Scope.REQUEST,
};

const ModelsRepositoryProvider: Provider<ModelsRepository> = {
  provide: 'ModelsRepository',
  useFactory: (dbClient: DbClient) => new PrismaModelsRepository(dbClient),
  inject: [DbClient],
  scope: Scope.REQUEST,
};

const AlterationsRepositoryProvider: Provider<AlterationsRepository> = {
  provide: 'AlterationsRepository',
  useFactory: (dbClient: DbClient) => new PrismaAlterationsRepository(dbClient),
  inject: [DbClient],
  scope: Scope.REQUEST,
};

const InformationsRepositoryProvider: Provider<InformationsRepository> = {
  provide: 'InformationsRepository',
  useFactory: (dbClient: DbClient) => new PrismaInformationsRepository(dbClient),
  inject: [DbClient],
  scope: Scope.REQUEST,
};

const OrdersRepositoryProvider: Provider<OrdersRepository> = {
  provide: 'OrdersRepository',
  useFactory: (dbClient: DbClient) => new PrismaOrdersRepository(dbClient),
  inject: [DbClient],
  scope: Scope.REQUEST,
};

const ConfirmReceiptUseCaseProvider: Provider<ConfirmReceiptUseCase> = {
  provide: ConfirmReceiptUseCase,
  useFactory: (repository: CustomerRepository) => new ConfirmReceiptUseCase(repository),
  inject: ['CustomerRepository'],
  scope: Scope.REQUEST,
};

const CreateOrderUseCaseProvider: Provider<CreateOrderUseCase> = {
  provide: CreateOrderUseCase,
  useFactory: (repository: OrdersRepository) => new CreateOrderUseCase(repository),
  inject: ['OrdersRepository'],
  scope: Scope.REQUEST,
};

const ConfirmPaymentUseCaseProvider: Provider<ConfirmPaymentUseCase> = {
  provide: ConfirmPaymentUseCase,
  useFactory: (repository: OrdersRepository) => new ConfirmPaymentUseCase(repository),
  inject: ['OrdersRepository'],
  scope: Scope.REQUEST,
};

export {
  CustomerRepositoryProvider,
  ModelsRepositoryProvider,
  AlterationsRepositoryProvider,
  InformationsRepositoryProvider,
  OrdersRepositoryProvider,
  ConfirmReceiptUseCaseProvider,
  CreateOrderUseCaseProvider,
  ConfirmPaymentUseCaseProvider,
};
