import { Provider, Scope } from '@nestjs/common';
import {
  DbClient,
  PrismaAlterationsRepository,
  PrismaCustomerRepository,
  PrismaInformationsRepository,
  PrismaModelsRepository,
  PrismaOrdersRepository,
  PrismaUsersRepository,
  PrismaWalletRepository,
} from '@tadil-database';
import {
  CustomerRepository,
  ConfirmReceiptUseCase,
} from '@tadil-customer';
import { ModelsRepository } from '@tadil-models';
import { AlterationsRepository } from '@tadil-alterations';
import { InformationsRepository } from '@tadil-informations';
import { UsersRepository } from '@tadil-users';
import {
  OrdersRepository,
  CreateOrderUseCase,
  ConfirmPaymentUseCase,
} from '@tadil-orders';
import {
  WalletRepository,
  CreditOrderEarningUseCase,
} from '@tadil-wallet';
import { MoyasarPaymentGateway } from '@tadil-payment';

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

const UsersRepositoryProvider: Provider<UsersRepository> = {
  provide: 'UsersRepository',
  useFactory: (dbClient: DbClient) => new PrismaUsersRepository(dbClient),
  inject: [DbClient],
  scope: Scope.REQUEST,
};

const WalletRepositoryProvider: Provider<WalletRepository> = {
  provide: 'WalletRepository',
  useFactory: (dbClient: DbClient) => new PrismaWalletRepository(dbClient),
  inject: [DbClient],
  scope: Scope.REQUEST,
};

const CreditOrderEarningUseCaseProvider: Provider<CreditOrderEarningUseCase> = {
  provide: CreditOrderEarningUseCase,
  useFactory: (repo: WalletRepository) => new CreditOrderEarningUseCase(repo),
  inject: ['WalletRepository'],
  scope: Scope.REQUEST,
};

const ConfirmReceiptUseCaseProvider: Provider<ConfirmReceiptUseCase> = {
  provide: ConfirmReceiptUseCase,
  useFactory: (
    custRepo: CustomerRepository,
    orderRepo: OrdersRepository,
    userRepo: UsersRepository,
    creditUseCase: CreditOrderEarningUseCase
  ) => new ConfirmReceiptUseCase(custRepo, orderRepo, userRepo, creditUseCase),
  inject: ['CustomerRepository', 'OrdersRepository', 'UsersRepository', CreditOrderEarningUseCase],
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
  useFactory: (repository: OrdersRepository) => {
    const paymentGateway = new MoyasarPaymentGateway(process.env.MOYASAR_SECRET_KEY || '');
    return new ConfirmPaymentUseCase(repository, paymentGateway);
  },
  inject: ['OrdersRepository'],
  scope: Scope.REQUEST,
};

export {
  CustomerRepositoryProvider,
  ModelsRepositoryProvider,
  AlterationsRepositoryProvider,
  InformationsRepositoryProvider,
  OrdersRepositoryProvider,
  UsersRepositoryProvider,
  WalletRepositoryProvider,
  ConfirmReceiptUseCaseProvider,
  CreateOrderUseCaseProvider,
  ConfirmPaymentUseCaseProvider,
  CreditOrderEarningUseCaseProvider,
};
