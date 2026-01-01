import { Module } from '@nestjs/common';
import {
  ExtrasRepositoryProvider,
  CreateExtraUseCaseProvider,
  UpdateExtraUseCaseProvider,
  DeleteExtraUseCaseProvider,
} from './extras.providers';
import { ExtrasController } from './extras.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ExtrasController],
  providers: [
    ExtrasRepositoryProvider,
    CreateExtraUseCaseProvider,
    UpdateExtraUseCaseProvider,
    DeleteExtraUseCaseProvider,
  ],
  exports: [],
})
export class ExtrasModule {}
