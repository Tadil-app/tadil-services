import { Provider, Scope } from '@nestjs/common';
import {
  InformationsRepository,
  CreateInformationUseCase,
  DeleteInformationUseCase,
  UpdateInformationUseCase,
} from '@tadil-informations';
import { DbClient, PrismaInformationsRepository } from '@tadil-database';

const InformationsRepositoryProvider: Provider<InformationsRepository> = {
  provide: 'InformationsRepository',
  useFactory: (dbClient: DbClient) =>
    new PrismaInformationsRepository(dbClient),
  scope: Scope.REQUEST,
  inject: [DbClient],
};

const CreateInformationUseCaseProvider: Provider<CreateInformationUseCase> = {
  provide: CreateInformationUseCase,
  useFactory: (informationsRepository: InformationsRepository) => {
    return new CreateInformationUseCase(informationsRepository);
  },
  scope: Scope.REQUEST,
  inject: ['InformationsRepository'],
};

const UpdateInformationUseCaseProvider: Provider<UpdateInformationUseCase> = {
  provide: UpdateInformationUseCase,
  useFactory: (informationsRepository: InformationsRepository) => {
    return new UpdateInformationUseCase(informationsRepository);
  },
  scope: Scope.REQUEST,
  inject: ['InformationsRepository'],
};

const DeleteInformationUseCaseProvider: Provider<DeleteInformationUseCase> = {
  provide: DeleteInformationUseCase,
  useFactory: (informationsRepository: InformationsRepository) => {
    return new DeleteInformationUseCase(informationsRepository);
  },
  scope: Scope.REQUEST,
  inject: ['InformationsRepository'],
};

export {
  InformationsRepositoryProvider,
  CreateInformationUseCaseProvider,
  UpdateInformationUseCaseProvider,
  DeleteInformationUseCaseProvider,
};
