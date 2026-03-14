import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import {
  OtpsRepositoryProvider,
  RequestOtpUseCaseProvider,
  SmsServiceProvider,
  UsersRepositoryProvider,
  VerifyOtpUseCaseProvider,
} from './auth.providers';

@Module({
  imports: [CommonModule],
  controllers: [AuthController],
  providers: [
    AuthGuard,
    OtpsRepositoryProvider,
    UsersRepositoryProvider,
    SmsServiceProvider,
    RequestOtpUseCaseProvider,
    VerifyOtpUseCaseProvider,
  ],
  exports: [AuthGuard],
})
export class AuthModule {}
