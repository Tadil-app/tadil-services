import { Module } from '@nestjs/common';
import {
  CreateModelUseCaseProvider,
  DeleteModelUseCaseProvider,
  ModelsRepositoryProvider,
} from './models.providers';
import { ModelsController } from './models.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ModelsController],
  providers: [
    ModelsRepositoryProvider,
    CreateModelUseCaseProvider,
    DeleteModelUseCaseProvider,
  ],
  exports: [],
})
export class ModelsModule {}
