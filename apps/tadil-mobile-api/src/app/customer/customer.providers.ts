import { Provider, Scope } from '@nestjs/common';
import {
  DbClient,
  PrismaAlterationsRepository,
  PrismaCustomerRepository,
  PrismaInformationsRepository,
  PrismaModelsRepository,
} from '@tadil-database';
import {
  CustomerRepository,
  ConfirmReceiptUseCase,
} from '@tadil-customer';
import { ModelsRepository } from '@tadil-models';
import { AlterationsRepository } from '@tadil-alterations';
import { InformationsRepository } from '@tadil-informations';

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

const ConfirmReceiptUseCaseProvider: Provider<ConfirmReceiptUseCase> = {
  provide: ConfirmReceiptUseCase,
  useFactory: (repository: CustomerRepository) => new ConfirmReceiptUseCase(repository),
  inject: ['CustomerRepository'],
  scope: Scope.REQUEST,
};

export {
  CustomerRepositoryProvider,
  ModelsRepositoryProvider,
  AlterationsRepositoryProvider,
  InformationsRepositoryProvider,
  ConfirmReceiptUseCaseProvider,
};
