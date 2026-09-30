import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import {
  UsersRepositoryProvider,
  LoginUseCaseProvider,
  CompleteProfileUseCaseProvider,
  AddAddressUseCaseProvider,
  UpdateAddressUseCaseProvider,
  DeleteAddressUseCaseProvider,
  DeleteMyAccountUseCaseProvider,
  GetMyAddressesUseCaseProvider,
} from './auth.providers';

@Module({
  imports: [CommonModule],
  controllers: [AuthController],
  providers: [
    AuthGuard,
    UsersRepositoryProvider,
    LoginUseCaseProvider,
    CompleteProfileUseCaseProvider,
    AddAddressUseCaseProvider,
    UpdateAddressUseCaseProvider,
    DeleteAddressUseCaseProvider,
    DeleteMyAccountUseCaseProvider,
    GetMyAddressesUseCaseProvider,
  ],
  exports: [AuthGuard],
})
export class AuthModule {}
