import { Provider, Scope } from '@nestjs/common';
import {
  DbClient,
  PrismaCourierRepository,
} from '@tadil-database';
import {
  CourierRepository,
  AcceptCourierAssignmentUseCase,
  DeclineCourierAssignmentUseCase,
  ConfirmPickupUseCase,
  MarkAsDeliveredUseCase,
} from '@tadil-courier';

const CourierRepositoryProvider: Provider<CourierRepository> = {
  provide: 'CourierRepository',
  useFactory: (dbClient: DbClient) => new PrismaCourierRepository(dbClient),
  inject: [DbClient],
  scope: Scope.REQUEST,
};

const AcceptCourierAssignmentUseCaseProvider: Provider<AcceptCourierAssignmentUseCase> = {
  provide: AcceptCourierAssignmentUseCase,
  useFactory: (repository: CourierRepository) => new AcceptCourierAssignmentUseCase(repository),
  inject: ['CourierRepository'],
  scope: Scope.REQUEST,
};

const DeclineCourierAssignmentUseCaseProvider: Provider<DeclineCourierAssignmentUseCase> = {
  provide: DeclineCourierAssignmentUseCase,
  useFactory: (repository: CourierRepository) => new DeclineCourierAssignmentUseCase(repository),
  inject: ['CourierRepository'],
  scope: Scope.REQUEST,
};

const ConfirmPickupUseCaseProvider: Provider<ConfirmPickupUseCase> = {
  provide: ConfirmPickupUseCase,
  useFactory: (repository: CourierRepository) => new ConfirmPickupUseCase(repository),
  inject: ['CourierRepository'],
  scope: Scope.REQUEST,
};

const MarkAsDeliveredUseCaseProvider: Provider<MarkAsDeliveredUseCase> = {
  provide: MarkAsDeliveredUseCase,
  useFactory: (repository: CourierRepository) => new MarkAsDeliveredUseCase(repository),
  inject: ['CourierRepository'],
  scope: Scope.REQUEST,
};

export {
  CourierRepositoryProvider,
  AcceptCourierAssignmentUseCaseProvider,
  DeclineCourierAssignmentUseCaseProvider,
  ConfirmPickupUseCaseProvider,
  MarkAsDeliveredUseCaseProvider,
};
