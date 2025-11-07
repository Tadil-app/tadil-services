import { Provider, Scope } from '@nestjs/common';
import { FileStorageService } from '@tadil-common';
import { DbClient, PrismaModelsRepository } from '@tadil-database';
import { CreateModelUseCase, ModelsRepository } from '@tadil-models';

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

export {
  ModelsRepositoryProvider,
  CreateModelUseCaseProvider,
};
