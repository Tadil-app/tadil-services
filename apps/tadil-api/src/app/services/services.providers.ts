import { Provider, Scope } from '@nestjs/common';
import { DbClient, PrismaServicesRepository } from '@tadil-database';
import {
  CreateServiceUseCase,
  DeleteServiceUseCase,
  ServicesRepository,
  UpdateServiceUseCase,
} from '@tadil-services';

const ServicesRepositoryProvider: Provider<ServicesRepository> = {
  provide: 'ServicesRepository',
  useFactory(dbClient: DbClient): ServicesRepository {
    return new PrismaServicesRepository(dbClient);
  },
  scope: Scope.REQUEST,
  inject: [DbClient],
};

const CreateServiceUseCaseProvider: Provider<CreateServiceUseCase> = {
  provide: CreateServiceUseCase,
  useFactory(servicesRepository: ServicesRepository): CreateServiceUseCase {
    return new CreateServiceUseCase(servicesRepository);
  },
  inject: ['ServicesRepository'],
};

const UpdateServiceUseCaseProvider: Provider<UpdateServiceUseCase> = {
  provide: UpdateServiceUseCase,
  useFactory(servicesRepository: ServicesRepository): UpdateServiceUseCase {
    return new UpdateServiceUseCase(servicesRepository);
  },
  inject: ['ServicesRepository'],
};

const DeleteServiceUseCaseProvider: Provider<DeleteServiceUseCase> = {
  provide: DeleteServiceUseCase,
  useFactory(servicesRepository: ServicesRepository): DeleteServiceUseCase {
    return new DeleteServiceUseCase(servicesRepository);
  },
  inject: ['ServicesRepository'],
};

export {
  ServicesRepositoryProvider,
  CreateServiceUseCaseProvider,
  UpdateServiceUseCaseProvider,
  DeleteServiceUseCaseProvider,
};
