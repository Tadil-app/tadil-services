import { Provider, Scope } from '@nestjs/common';
import {
  DbClient,
  PrismaOtpsRepository,
  PrismaUsersRepository,
} from '@tadil-database';
import {
  OtpsRepository,
  RequestOtpUseCase,
  VerifyOtpUseCase,
} from '@tadil-auth';
import { UsersRepository } from '@tadil-users';
import { environment } from '../../environments/environment';
import { SmsService } from '@tadil-common';
import { TwilioSmsService } from '@tadil-sms';

// --- Repositories
const OtpsRepositoryProvider: Provider<OtpsRepository> = {
  provide: 'OtpsRepository',
  useFactory: (dbClient: DbClient) => new PrismaOtpsRepository(dbClient),
  scope: Scope.REQUEST,
  inject: [DbClient],
};

const UsersRepositoryProvider: Provider<UsersRepository> = {
  provide: 'UsersRepository',
  useFactory: (dbClient: DbClient) => new PrismaUsersRepository(dbClient),
  scope: Scope.REQUEST,
  inject: [DbClient],
};

// --- Services
const SmsServiceProvider: Provider<SmsService> = {
  provide: 'SmsService',
  useFactory: () => {
    const { accountSid, authToken, fromPhone } = environment.twilio;
    if (!accountSid || !authToken || !fromPhone) {
      // In a real app, you might want a fallback or a more robust error log
      console.error(
        'Twilio credentials are not configured. SMS will not be sent.'
      );
      // Return a mock service that does nothing to prevent crashes
      return { send: () => Promise.resolve() };
    }
    return new TwilioSmsService(accountSid, authToken, fromPhone);
  },
};

// --- Use Cases
const RequestOtpUseCaseProvider: Provider<RequestOtpUseCase> = {
  provide: RequestOtpUseCase,
  useFactory: (otpsRepository: OtpsRepository, smsService: SmsService) => {
    return new RequestOtpUseCase(otpsRepository, smsService);
  },
  scope: Scope.REQUEST,
  inject: ['OtpsRepository', 'SmsService'],
};

const VerifyOtpUseCaseProvider: Provider<VerifyOtpUseCase> = {
  provide: VerifyOtpUseCase,
  useFactory: (
    otpsRepository: OtpsRepository,
    usersRepository: UsersRepository
  ) => {
    const secret = environment.jwtSecret || 'super-secret';
    return new VerifyOtpUseCase(otpsRepository, usersRepository, secret);
  },
  scope: Scope.REQUEST,
  inject: ['OtpsRepository', 'UsersRepository'],
};

export {
  OtpsRepositoryProvider,
  UsersRepositoryProvider,
  SmsServiceProvider,
  RequestOtpUseCaseProvider,
  VerifyOtpUseCaseProvider,
};
