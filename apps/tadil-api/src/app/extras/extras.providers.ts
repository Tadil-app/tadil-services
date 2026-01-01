import { Provider, Scope } from '@nestjs/common';
import { DbClient, PrismaExtrasRepository } from '@tadil-database';
import {
  CreateExtraUseCase,
  DeleteExtraUseCase,
  ExtrasRepository,
  UpdateExtraUseCase,
} from '@tadil-extras';

const ExtrasRepositoryProvider: Provider<ExtrasRepository> = {
  provide: 'ExtrasRepository',
  useFactory(dbClient: DbClient): ExtrasRepository {
    return new PrismaExtrasRepository(dbClient);
  },
  scope: Scope.REQUEST,
  inject: [DbClient],
};

const CreateExtraUseCaseProvider: Provider<CreateExtraUseCase> = {
  provide: CreateExtraUseCase,
  useFactory(extrasRepository: ExtrasRepository): CreateExtraUseCase {
    return new CreateExtraUseCase(extrasRepository);
  },
  inject: ['ExtrasRepository'],
};

const UpdateExtraUseCaseProvider: Provider<UpdateExtraUseCase> = {
  provide: UpdateExtraUseCase,
  useFactory(extrasRepository: ExtrasRepository): UpdateExtraUseCase {
    return new UpdateExtraUseCase(extrasRepository);
  },
  inject: ['ExtrasRepository'],
};

const DeleteExtraUseCaseProvider: Provider<DeleteExtraUseCase> = {
  provide: DeleteExtraUseCase,
  useFactory(extrasRepository: ExtrasRepository): DeleteExtraUseCase {
    return new DeleteExtraUseCase(extrasRepository);
  },
  inject: ['ExtrasRepository'],
};

export {
  ExtrasRepositoryProvider,
  CreateExtraUseCaseProvider,
  UpdateExtraUseCaseProvider,
  DeleteExtraUseCaseProvider,
};
