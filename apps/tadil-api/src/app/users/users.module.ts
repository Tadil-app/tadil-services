import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import {
  TailorsController,
  CouriersController,
  CustomersController,
  LoginRequestsController,
  PayoutRequestsController,
} from './controllers';
import {
  UsersRepositoryProvider,
  WalletRepositoryProvider,
  CreateUserUseCaseProvider,
  UpdateUserUseCaseProvider,
  DeleteUserUseCaseProvider,
  ApproveLoginRequestUseCaseProvider,
  RejectLoginRequestUseCaseProvider,
  GetPendingLoginRequestsUseCaseProvider,
  FulfillPayoutUseCaseProvider,
  RejectPayoutUseCaseProvider,
} from './users.providers';

@Module({
  imports: [CommonModule],
  controllers: [
    TailorsController,
    CouriersController,
    CustomersController,
    LoginRequestsController,
    PayoutRequestsController,
  ],
  providers: [
    UsersRepositoryProvider,
    WalletRepositoryProvider,
    CreateUserUseCaseProvider,
    UpdateUserUseCaseProvider,
    DeleteUserUseCaseProvider,
    ApproveLoginRequestUseCaseProvider,
    RejectLoginRequestUseCaseProvider,
    GetPendingLoginRequestsUseCaseProvider,
    FulfillPayoutUseCaseProvider,
    RejectPayoutUseCaseProvider,
  ],
})
export class UsersModule {}
