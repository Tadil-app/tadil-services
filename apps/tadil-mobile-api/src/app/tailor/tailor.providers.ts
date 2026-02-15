import {
  AcceptOrderUseCase,
  DeclineOrderUseCase,
  TailorRepository,
} from '@tadil-tailor';
import { Provider, Scope } from '@nestjs/common';
import { DbClient, PrismaTailorRepository } from '@tadil-database';

const TailorRepositoryProvider: Provider<TailorRepository> = {
  provide: 'TailorRepository',
  useFactory: (dbClient: DbClient) => new PrismaTailorRepository(dbClient),
  scope: Scope.REQUEST,
  inject: [DbClient],
};

const AcceptOrderUseCaseProvider: Provider<AcceptOrderUseCase> = {
  provide: AcceptOrderUseCase,
  useFactory: (tailorRepository: TailorRepository) =>
    new AcceptOrderUseCase(tailorRepository),
  scope: Scope.REQUEST,
  inject: ['TailorRepository'],
};

const DeclineOrderUseCaseProvider: Provider<DeclineOrderUseCase> = {
  provide: DeclineOrderUseCase,
  useFactory: (tailorRepository: TailorRepository) =>
    new DeclineOrderUseCase(tailorRepository),
  scope: Scope.REQUEST,
  inject: ['TailorRepository'],
};

export {
  TailorRepositoryProvider,
  AcceptOrderUseCaseProvider,
  DeclineOrderUseCaseProvider,
};
