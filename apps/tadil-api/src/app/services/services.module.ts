import { Module } from '@nestjs/common';
import {
  ServicesRepositoryProvider,
  CreateServiceUseCaseProvider,
  UpdateServiceUseCaseProvider,
  DeleteServiceUseCaseProvider,
} from './services.providers';
import { ServicesController } from './services.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
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
