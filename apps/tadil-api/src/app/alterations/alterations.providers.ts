import { Provider, Scope } from '@nestjs/common';
import { DbClient, PrismaAlterationsRepository } from '@tadil-database';
import {
  CreateAlterationUseCase,
  DeleteAlterationUseCase,
  AlterationsRepository,
  UpdateAlterationUseCase,
} from '@tadil-alterations';

const AlterationsRepositoryProvider: Provider<AlterationsRepository> = {
  provide: 'AlterationsRepository',
  useFactory(dbClient: DbClient): AlterationsRepository {
    return new PrismaAlterationsRepository(dbClient);
  },
  scope: Scope.REQUEST,
  inject: [DbClient],
};

const CreateAlterationUseCaseProvider: Provider<CreateAlterationUseCase> = {
  provide: CreateAlterationUseCase,
  useFactory(alterationsRepository: AlterationsRepository): CreateAlterationUseCase {
    return new CreateAlterationUseCase(alterationsRepository);
  },
  inject: ['AlterationsRepository'],
};

const UpdateAlterationUseCaseProvider: Provider<UpdateAlterationUseCase> = {
  provide: UpdateAlterationUseCase,
  useFactory(alterationsRepository: AlterationsRepository): UpdateAlterationUseCase {
    return new UpdateAlterationUseCase(alterationsRepository);
  },
  inject: ['AlterationsRepository'],
};

const DeleteAlterationUseCaseProvider: Provider<DeleteAlterationUseCase> = {
  provide: DeleteAlterationUseCase,
  useFactory(alterationsRepository: AlterationsRepository): DeleteAlterationUseCase {
    return new DeleteAlterationUseCase(alterationsRepository);
  },
  inject: ['AlterationsRepository'],
};

export {
  AlterationsRepositoryProvider,
  CreateAlterationUseCaseProvider,
  UpdateAlterationUseCaseProvider,
  DeleteAlterationUseCaseProvider,
};
