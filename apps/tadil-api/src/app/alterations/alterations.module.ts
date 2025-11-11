import { Module } from '@nestjs/common';
import {
  AlterationsRepositoryProvider,
  CreateAlterationUseCaseProvider,
  UpdateAlterationUseCaseProvider,
  DeleteAlterationUseCaseProvider,
} from './alterations.providers';
import { AlterationsController } from './alterations.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [AlterationsController],
  providers: [
    AlterationsRepositoryProvider,
    CreateAlterationUseCaseProvider,
    UpdateAlterationUseCaseProvider,
    DeleteAlterationUseCaseProvider,
  ],
  exports: [],
})
export class AlterationsModule {}
