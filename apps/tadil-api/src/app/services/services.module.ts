import { Module } from '@nestjs/common';
import {
  ServicesRepositoryProvider,
  CreateServiceUseCaseProvider,
  UpdateServiceUseCaseProvider,
  DeleteServiceUseCaseProvider,
} from './services.providers';
import { ServicesController } from './services.controller';

@Module({
  controllers: [ServicesController],
  providers: [
    ServicesRepositoryProvider,
    CreateServiceUseCaseProvider,
    UpdateServiceUseCaseProvider,
    DeleteServiceUseCaseProvider,
  ],
  exports: [],
})
export class ServicesModule {}
