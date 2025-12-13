import { Provider, Scope } from '@nestjs/common';
import { FileStorageService } from '@tadil-common';
import { DbClient, PrismaModelsRepository } from '@tadil-database';
import {
  CreateModelUseCase,
  ModelsRepository,
  DeleteModelUseCase,
  AddSectionUseCase,
  DeleteSectionUseCase,
  UpdateModelUseCase,
  AddModelImageUseCase,
  DeleteModelImageUseCase,
} from '@tadil-models';

const ModelsRepositoryProvider: Provider<ModelsRepository> = {
  provide: 'ModelsRepository',
  useFactory: (dbClient: DbClient) => new PrismaModelsRepository(dbClient),
  scope: Scope.REQUEST,
  inject: [DbClient],
};

const CreateModelUseCaseProvider: Provider<CreateModelUseCase> = {
  provide: CreateModelUseCase,
  useFactory: (modelsRepository: ModelsRepository) => {
    return new CreateModelUseCase(modelsRepository);
  },
  scope: Scope.REQUEST,
  inject: ['ModelsRepository'],
};

const UpdateModelUseCaseProvider: Provider<UpdateModelUseCase> = {
  provide: UpdateModelUseCase,
  useFactory: (modelsRepository: ModelsRepository) => {
    return new UpdateModelUseCase(modelsRepository);
  },
  scope: Scope.REQUEST,
  inject: ['ModelsRepository'],
};

const DeleteModelUseCaseProvider: Provider<DeleteModelUseCase> = {
  provide: DeleteModelUseCase,
  useFactory: (
    modelsRepository: ModelsRepository,
    fileStorageService: FileStorageService
  ) => {
    return new DeleteModelUseCase(modelsRepository, fileStorageService);
  },
  scope: Scope.REQUEST,
  inject: ['ModelsRepository', 'FileStorageService'],
};

const AddModelImageUseCaseProvider: Provider<AddModelImageUseCase> = {
  provide: AddModelImageUseCase,
  useFactory: (
    modelsRepository: ModelsRepository,
    fileStorageService: FileStorageService
  ) => {
    return new AddModelImageUseCase(modelsRepository, fileStorageService);
  },
  scope: Scope.REQUEST,
  inject: ['ModelsRepository', 'FileStorageService'],
};

const DeleteModelImageUseCaseProvider: Provider<DeleteModelImageUseCase> = {
  provide: DeleteModelImageUseCase,
  useFactory: (
    modelsRepository: ModelsRepository,
    fileStorageService: FileStorageService
  ) => {
    return new DeleteModelImageUseCase(modelsRepository, fileStorageService);
  },
  scope: Scope.REQUEST,
  inject: ['ModelsRepository', 'FileStorageService'],
};

const AddSectionUseCaseProvider: Provider<AddSectionUseCase> = {
  provide: AddSectionUseCase,
  useFactory: (modelsRepository: ModelsRepository) => {
    return new AddSectionUseCase(modelsRepository);
  },
  scope: Scope.REQUEST,
  inject: ['ModelsRepository'],
};

const DeleteSectionUseCaseProvider: Provider<DeleteSectionUseCase> = {
  provide: DeleteSectionUseCase,
  useFactory: (modelsRepository: ModelsRepository) => {
    return new DeleteSectionUseCase(modelsRepository);
  },
  scope: Scope.REQUEST,
  inject: ['ModelsRepository'],
};

export {
  ModelsRepositoryProvider,
  CreateModelUseCaseProvider,
  DeleteModelUseCaseProvider,
  AddModelImageUseCaseProvider,
  DeleteModelImageUseCaseProvider,
  AddSectionUseCaseProvider,
  DeleteSectionUseCaseProvider,
  UpdateModelUseCaseProvider,
};
