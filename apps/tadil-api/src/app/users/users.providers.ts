import { Provider, Scope } from '@nestjs/common';
import { DbClient, PrismaUsersRepository, PrismaWalletRepository } from '@tadil-database';
import {
  UsersRepository,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '@tadil-users';
import {
  ApproveLoginRequestUseCase,
  RejectLoginRequestUseCase,
  GetPendingLoginRequestsUseCase,
} from '@tadil-auth';
import {
  WalletRepository,
  FulfillPayoutUseCase,
  RejectPayoutUseCase,
} from '@tadil-wallet';
import { environment } from '../../environments/environment';

const UsersRepositoryProvider: Provider<UsersRepository> = {
  provide: 'UsersRepository',
  useFactory: (dbClient: DbClient) => {
    return new PrismaUsersRepository(dbClient);
  },
  scope: Scope.REQUEST,
  inject: [DbClient],
};

const WalletRepositoryProvider: Provider<WalletRepository> = {
  provide: 'WalletRepository',
  useFactory: (dbClient: DbClient) => {
    return new PrismaWalletRepository(dbClient);
  },
  scope: Scope.REQUEST,
  inject: [DbClient],
};

const CreateUserUseCaseProvider: Provider<CreateUserUseCase> = {
  provide: CreateUserUseCase,
  useFactory: (usersRepository: UsersRepository) => {
    return new CreateUserUseCase(usersRepository);
  },
  scope: Scope.REQUEST,
  inject: ['UsersRepository'],
};

const UpdateUserUseCaseProvider: Provider<UpdateUserUseCase> = {
  provide: UpdateUserUseCase,
  useFactory: (usersRepository: UsersRepository) => {
    return new UpdateUserUseCase(usersRepository);
  },
  scope: Scope.REQUEST,
  inject: ['UsersRepository'],
};

const DeleteUserUseCaseProvider: Provider<DeleteUserUseCase> = {
  provide: DeleteUserUseCase,
  useFactory: (usersRepository: UsersRepository) => {
    return new DeleteUserUseCase(usersRepository);
  },
  scope: Scope.REQUEST,
  inject: ['UsersRepository'],
};

const ApproveLoginRequestUseCaseProvider: Provider<ApproveLoginRequestUseCase> = {
  provide: ApproveLoginRequestUseCase,
  useFactory: (usersRepository: UsersRepository) => {
    const secret = environment.jwtSecret || 'super-secret';
    return new ApproveLoginRequestUseCase(usersRepository, secret);
  },
  scope: Scope.REQUEST,
  inject: ['UsersRepository'],
};

const RejectLoginRequestUseCaseProvider: Provider<RejectLoginRequestUseCase> = {
  provide: RejectLoginRequestUseCase,
  useFactory: (usersRepository: UsersRepository) => {
    return new RejectLoginRequestUseCase(usersRepository);
  },
  scope: Scope.REQUEST,
  inject: ['UsersRepository'],
};

const GetPendingLoginRequestsUseCaseProvider: Provider<GetPendingLoginRequestsUseCase> = {
  provide: GetPendingLoginRequestsUseCase,
  useFactory: (usersRepository: UsersRepository) => {
    return new GetPendingLoginRequestsUseCase(usersRepository);
  },
  scope: Scope.REQUEST,
  inject: ['UsersRepository'],
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

export {
  UsersRepositoryProvider,
  WalletRepositoryProvider,
  CreateUserUseCaseProvider,
  UpdateUserUseCaseProvider,
  DeleteUserUseCaseProvider,
  ApproveLoginRequestUseCaseProvider,
  RejectLoginRequestUseCaseProvider,
  GetPendingLoginRequestsUseCaseProvider,
  FulfillPayoutUseCaseProvider,
  RejectPayoutUseCaseProvider,
};
