import { Provider, Scope } from '@nestjs/common';
import {
  DbClient,
  PrismaUsersRepository,
} from '@tadil-database';
import {
  LoginUseCase,
  CompleteProfileUseCase,
  ApproveLoginRequestUseCase,
  RejectLoginRequestUseCase,
  GetPendingLoginRequestsUseCase,
} from '@tadil-auth';
import {
  UsersRepository,
  AddAddressUseCase,
  UpdateAddressUseCase,
  DeleteAddressUseCase,
  GetMyAddressesUseCase,
} from '@tadil-users';
import { environment } from '../../environments/environment';

const UsersRepositoryProvider: Provider<UsersRepository> = {
  provide: 'UsersRepository',
  useFactory: (dbClient: DbClient) => new PrismaUsersRepository(dbClient),
  scope: Scope.REQUEST,
  inject: [DbClient],
};

// --- Use Cases
const LoginUseCaseProvider: Provider<LoginUseCase> = {
  provide: LoginUseCase,
  useFactory: (usersRepository: UsersRepository) => {
    const secret = environment.jwtSecret || 'super-secret';
    return new LoginUseCase(usersRepository, secret);
  },
  scope: Scope.REQUEST,
  inject: ['UsersRepository'],
};

const CompleteProfileUseCaseProvider: Provider<CompleteProfileUseCase> = {
  provide: CompleteProfileUseCase,
  useFactory: (usersRepository: UsersRepository) => {
    const secret = environment.jwtSecret || 'super-secret';
    return new CompleteProfileUseCase(usersRepository, secret);
  },
  scope: Scope.REQUEST,
  inject: ['UsersRepository'],
};

const ApproveLoginRequestUseCaseProvider: Provider<ApproveLoginRequestUseCase> = {
  provide: ApproveLoginRequestUseCase,
  useFactory: (usersRepository: UsersRepository) => {
    const secret = environment.jwtSecret || 'super-secret';
    return new ApproveLoginRequestUseCase(usersRepository, secret);
  },
  scope: Scope.REQUEST,
  inject: ['UsersRepository'],
};

const RejectLoginRequestUseCaseProvider: Provider<RejectLoginRequestUseCase> = {
  provide: RejectLoginRequestUseCase,
  useFactory: (usersRepository: UsersRepository) => {
    return new RejectLoginRequestUseCase(usersRepository);
  },
  scope: Scope.REQUEST,
  inject: ['UsersRepository'],
};

const GetPendingLoginRequestsUseCaseProvider: Provider<GetPendingLoginRequestsUseCase> = {
  provide: GetPendingLoginRequestsUseCase,
  useFactory: (usersRepository: UsersRepository) => {
    return new GetPendingLoginRequestsUseCase(usersRepository);
  },
  scope: Scope.REQUEST,
  inject: ['UsersRepository'],
};

const AddAddressUseCaseProvider: Provider<AddAddressUseCase> = {
  provide: AddAddressUseCase,
  useFactory: (usersRepository: UsersRepository) => {
    return new AddAddressUseCase(usersRepository);
  },
  scope: Scope.REQUEST,
  inject: ['UsersRepository'],
};

const UpdateAddressUseCaseProvider: Provider<UpdateAddressUseCase> = {
  provide: UpdateAddressUseCase,
  useFactory: (usersRepository: UsersRepository) => {
    return new UpdateAddressUseCase(usersRepository);
  },
  scope: Scope.REQUEST,
  inject: ['UsersRepository'],
};

const GetMyAddressesUseCaseProvider: Provider<GetMyAddressesUseCase> = {
  provide: GetMyAddressesUseCase,
  useFactory: (usersRepository: UsersRepository) => {
    return new GetMyAddressesUseCase(usersRepository);
  },
  scope: Scope.REQUEST,
  inject: ['UsersRepository'],
};

const DeleteAddressUseCaseProvider: Provider<DeleteAddressUseCase> = {
  provide: DeleteAddressUseCase,
  useFactory: (usersRepository: UsersRepository) => {
    return new DeleteAddressUseCase(usersRepository);
  },
  scope: Scope.REQUEST,
  inject: ['UsersRepository'],
};

export {
  UsersRepositoryProvider,
  LoginUseCaseProvider,
  CompleteProfileUseCaseProvider,
  ApproveLoginRequestUseCaseProvider,
  RejectLoginRequestUseCaseProvider,
  GetPendingLoginRequestsUseCaseProvider,
  AddAddressUseCaseProvider,
  UpdateAddressUseCaseProvider,
  DeleteAddressUseCaseProvider,
  GetMyAddressesUseCaseProvider,
};
