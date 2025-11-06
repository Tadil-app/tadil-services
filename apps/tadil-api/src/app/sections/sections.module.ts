import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import {
  CreateSectionUseCaseProvider,
  DeleteSectionUseCaseProvider,
  SectionsRepositoryProvider,
  UpdateSectionUseCaseProvider,
} from './sections.providers';
import { SectionsController } from './sections.controller';

@Module({
  imports: [CommonModule],
  controllers: [SectionsController],
  providers: [
    SectionsRepositoryProvider,
    CreateSectionUseCaseProvider,
    UpdateSectionUseCaseProvider,
    DeleteSectionUseCaseProvider,
  ],
  exports: [],
})
export class SectionsModule {}
