import { Provider, Scope } from '@nestjs/common';
import { DbClient, PrismaSectionsRepository } from '@tadil-database';
import {
  CreateSectionUseCase,
  DeleteSectionUseCase,
  SectionsRepository,
  UpdateSectionUseCase,
} from '@tadil-sections';

const SectionsRepositoryProvider: Provider<SectionsRepository> = {
  provide: 'SectionsRepository',
  useFactory: (dbClient: DbClient) => new PrismaSectionsRepository(dbClient),
  scope: Scope.REQUEST,
  inject: [DbClient],
};

const CreateSectionUseCaseProvider: Provider<CreateSectionUseCase> = {
  provide: CreateSectionUseCase,
  useFactory: (sectionsRepository: SectionsRepository) =>
    new CreateSectionUseCase(sectionsRepository),
  scope: Scope.REQUEST,
  inject: ['SectionsRepository'],
};

const UpdateSectionUseCaseProvider: Provider<UpdateSectionUseCase> = {
  provide: UpdateSectionUseCase,
  useFactory: (sectionsRepository: SectionsRepository) =>
    new UpdateSectionUseCase(sectionsRepository),
  scope: Scope.REQUEST,
  inject: ['SectionsRepository'],
};

const DeleteSectionUseCaseProvider: Provider<DeleteSectionUseCase> = {
  provide: DeleteSectionUseCase,
  useFactory: (sectionsRepository: SectionsRepository) =>
    new DeleteSectionUseCase(sectionsRepository),
  scope: Scope.REQUEST,
  inject: ['SectionsRepository'],
};

export {
  SectionsRepositoryProvider,
  CreateSectionUseCaseProvider,
  UpdateSectionUseCaseProvider,
  DeleteSectionUseCaseProvider,
};
