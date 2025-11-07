import { Module } from '@nestjs/common';
import {
  AddSectionUseCaseProvider,
  CreateModelUseCaseProvider,
  DeleteModelUseCaseProvider,
  DeleteSectionUseCaseProvider,
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
    AddSectionUseCaseProvider,
    DeleteSectionUseCaseProvider,
  ],
  exports: [],
})
export class ModelsModule {}
