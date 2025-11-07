import { Provider, Scope } from '@nestjs/common';
import {
  AlterationsRepository,
  CreateAlterationUseCase,
  DeleteAlterationUseCase,
  UpdateAlterationUseCase,
} from '@tadil-alterations';
import { DbClient, PrismaAlterationsRepository } from '@tadil-database';

const AlterationsRepositoryProvider: Provider<AlterationsRepository> = {
  provide: 'AlterationsRepository',
  useFactory: (dbClient: DbClient) => new PrismaAlterationsRepository(dbClient),
  scope: Scope.REQUEST,
  inject: [DbClient],
};

const CreateAlterationUseCaseProvider: Provider<CreateAlterationUseCase> = {
  provide: CreateAlterationUseCase,
  useFactory: (alterationsRepository: AlterationsRepository) => {
    return new CreateAlterationUseCase(alterationsRepository);
  },
  scope: Scope.REQUEST,
  inject: ['AlterationsRepository'],
};

const UpdateAlterationUseCaseProvider: Provider<UpdateAlterationUseCase> = {
  provide: UpdateAlterationUseCase,
  useFactory: (alterationsRepository: AlterationsRepository) => {
    return new UpdateAlterationUseCase(alterationsRepository);
  },
  scope: Scope.REQUEST,
  inject: ['AlterationsRepository'],
};

const DeleteAlterationUseCaseProvider: Provider<DeleteAlterationUseCase> = {
  provide: DeleteAlterationUseCase,
  useFactory: (alterationsRepository: AlterationsRepository) => {
    return new DeleteAlterationUseCase(alterationsRepository);
  },
  scope: Scope.REQUEST,
  inject: ['AlterationsRepository'],
};

export {
  AlterationsRepositoryProvider,
  CreateAlterationUseCaseProvider,
  UpdateAlterationUseCaseProvider,
  DeleteAlterationUseCaseProvider,
};
