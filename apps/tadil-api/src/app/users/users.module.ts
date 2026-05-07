import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import {
  TailorsController,
  CouriersController,
  LoginRequestsController,
} from './controllers';
import {
  UsersRepositoryProvider,
  CreateUserUseCaseProvider,
  UpdateUserUseCaseProvider,
  DeleteUserUseCaseProvider,
  ApproveLoginRequestUseCaseProvider,
  RejectLoginRequestUseCaseProvider,
  GetPendingLoginRequestsUseCaseProvider,
} from './users.providers';

@Module({
  imports: [CommonModule],
  controllers: [TailorsController, CouriersController, LoginRequestsController],
  providers: [
    UsersRepositoryProvider,
    CreateUserUseCaseProvider,
    UpdateUserUseCaseProvider,
    DeleteUserUseCaseProvider,
    ApproveLoginRequestUseCaseProvider,
    RejectLoginRequestUseCaseProvider,
    GetPendingLoginRequestsUseCaseProvider,
  ],
})
export class UsersModule {}
