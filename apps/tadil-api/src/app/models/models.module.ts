import { Module } from '@nestjs/common';
import {
  CreateModelUseCaseProvider,
  ModelsRepositoryProvider,
} from './models.providers';
import { ModelsController } from './models.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ModelsController],
  providers: [ModelsRepositoryProvider, CreateModelUseCaseProvider],
  exports: [],
})
export class ModelsModule {}
