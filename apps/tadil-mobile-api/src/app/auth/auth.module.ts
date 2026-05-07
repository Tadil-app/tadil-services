import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import {
  UsersRepositoryProvider,
  LoginUseCaseProvider,
  CompleteProfileUseCaseProvider,
} from './auth.providers';

@Module({
  imports: [CommonModule],
  controllers: [AuthController],
  providers: [
    AuthGuard,
    UsersRepositoryProvider,
    LoginUseCaseProvider,
    CompleteProfileUseCaseProvider,
  ],
  exports: [AuthGuard],
})
export class AuthModule {}
