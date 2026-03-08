import { Module } from '@nestjs/common';
import {
  AddModelImageUseCaseProvider,
  AddSectionUseCaseProvider,
  UpdateSectionUseCaseProvider,
  CreateModelUseCaseProvider,
  DeleteModelImageUseCaseProvider,
  DeleteModelUseCaseProvider,
  DeleteSectionUseCaseProvider,
  ModelsRepositoryProvider,
  UpdateModelUseCaseProvider,
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
    AddModelImageUseCaseProvider,
    DeleteModelImageUseCaseProvider,
    AddSectionUseCaseProvider,
    UpdateSectionUseCaseProvider,
    DeleteSectionUseCaseProvider,
    UpdateModelUseCaseProvider,
  ],
  exports: [],
})
export class ModelsModule {}
