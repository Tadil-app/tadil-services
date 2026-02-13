import { Provider, Scope } from '@nestjs/common';
import { DbClient, PrismaUsersRepository } from '@tadil-database';
import {
  UsersRepository,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '@tadil-users';

const UsersRepositoryProvider: Provider<UsersRepository> = {
  provide: 'UsersRepository',
  useFactory: (dbClient: DbClient) => {
    return new PrismaUsersRepository(dbClient);
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

export {
  UsersRepositoryProvider,
  CreateUserUseCaseProvider,
  UpdateUserUseCaseProvider,
  DeleteUserUseCaseProvider,
};
