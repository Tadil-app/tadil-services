import { Provider, Scope } from '@nestjs/common';
import { DbClient, PrismaWalletRepository } from '@tadil-database';
import {
  WalletRepository,
  GetWalletDetailsUseCase,
  RequestPayoutUseCase,
  FulfillPayoutUseCase,
  RejectPayoutUseCase,
  CreditOrderEarningUseCase,
} from '@tadil-wallet';

const WalletRepositoryProvider: Provider<WalletRepository> = {
  provide: 'WalletRepository',
  useFactory: (dbClient: DbClient) => new PrismaWalletRepository(dbClient),
  inject: [DbClient],
  scope: Scope.REQUEST,
};

const GetWalletDetailsUseCaseProvider: Provider<GetWalletDetailsUseCase> = {
  provide: GetWalletDetailsUseCase,
  useFactory: (repo: WalletRepository) => new GetWalletDetailsUseCase(repo),
  inject: ['WalletRepository'],
  scope: Scope.REQUEST,
};

const RequestPayoutUseCaseProvider: Provider<RequestPayoutUseCase> = {
  provide: RequestPayoutUseCase,
  useFactory: (repo: WalletRepository) => new RequestPayoutUseCase(repo),
  inject: ['WalletRepository'],
  scope: Scope.REQUEST,
};

const FulfillPayoutUseCaseProvider: Provider<FulfillPayoutUseCase> = {
  provide: FulfillPayoutUseCase,
  useFactory: (repo: WalletRepository) => new FulfillPayoutUseCase(repo),
  inject: ['WalletRepository'],
  scope: Scope.REQUEST,
};

const RejectPayoutUseCaseProvider: Provider<RejectPayoutUseCase> = {
  provide: RejectPayoutUseCase,
  useFactory: (repo: WalletRepository) => new RejectPayoutUseCase(repo),
  inject: ['WalletRepository'],
  scope: Scope.REQUEST,
};

const CreditOrderEarningUseCaseProvider: Provider<CreditOrderEarningUseCase> = {
  provide: CreditOrderEarningUseCase,
  useFactory: (repo: WalletRepository) => new CreditOrderEarningUseCase(repo),
  inject: ['WalletRepository'],
  scope: Scope.REQUEST,
};

export {
  WalletRepositoryProvider,
  GetWalletDetailsUseCaseProvider,
  RequestPayoutUseCaseProvider,
  FulfillPayoutUseCaseProvider,
  RejectPayoutUseCaseProvider,
  CreditOrderEarningUseCaseProvider,
};
