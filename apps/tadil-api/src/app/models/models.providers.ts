import { Provider, Scope } from '@nestjs/common';
import { FileStorageService } from '@tadil-common';
import { DbClient, PrismaModelsRepository } from '@tadil-database';
import {
  CreateModelUseCase,
  ModelsRepository,
  DeleteModelUseCase,
} from '@tadil-models';

const ModelsRepositoryProvider: Provider<ModelsRepository> = {
  provide: 'ModelsRepository',
  useFactory: (dbClient: DbClient) => new PrismaModelsRepository(dbClient),
  scope: Scope.REQUEST,
  inject: [DbClient],
};

const CreateModelUseCaseProvider: Provider<CreateModelUseCase> = {
  provide: CreateModelUseCase,
  useFactory: (
    modelsRepository: ModelsRepository,
    fileStorageService: FileStorageService
  ) => {
    return new CreateModelUseCase(modelsRepository, fileStorageService);
  },
  scope: Scope.REQUEST,
  inject: ['ModelsRepository', 'FileStorageService'],
};

const DeleteModelUseCaseProvider: Provider<DeleteModelUseCase> = {
  provide: DeleteModelUseCase,
  useFactory: (modelsRepository: ModelsRepository) => {
    return new DeleteModelUseCase(modelsRepository);
  },
  scope: Scope.REQUEST,
  inject: ['ModelsRepository'],
};

export {
  ModelsRepositoryProvider,
  CreateModelUseCaseProvider,
  DeleteModelUseCaseProvider,
};
