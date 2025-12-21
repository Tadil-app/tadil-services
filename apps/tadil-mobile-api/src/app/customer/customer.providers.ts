import { Provider, Scope } from '@nestjs/common';
import { AlterationsRepository } from '@tadil-alterations';
import {
  DbClient,
  PrismaAlterationsRepository,
  PrismaInformationsRepository,
  PrismaModelsRepository,
} from '@tadil-database';
import { InformationsRepository } from '@tadil-informations';
import { ModelsRepository } from '@tadil-models';

const ModelsRepositoryProvider: Provider<ModelsRepository> = {
  provide: 'ModelsRepository',
  useFactory: (dbClient: DbClient) => new PrismaModelsRepository(dbClient),
  scope: Scope.REQUEST,
  inject: [DbClient],
};
const AlterationsRepositoryProvider: Provider<AlterationsRepository> = {
  provide: 'AlterationsRepository',
  useFactory(dbClient: DbClient): AlterationsRepository {
    return new PrismaAlterationsRepository(dbClient);
  },
  scope: Scope.REQUEST,
  inject: [DbClient],
};

const InformationsRepositoryProvider: Provider<InformationsRepository> = {
  provide: 'InformationsRepository',
  useFactory: (dbClient: DbClient) =>
    new PrismaInformationsRepository(dbClient),
  scope: Scope.REQUEST,
  inject: [DbClient],
};

export {
  ModelsRepositoryProvider,
  AlterationsRepositoryProvider,
  InformationsRepositoryProvider,
};
