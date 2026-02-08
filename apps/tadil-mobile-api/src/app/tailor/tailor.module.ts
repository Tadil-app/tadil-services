import { Module } from '@nestjs/common';
import {
  TailorRepositoryProvider,
  AcceptOrderUseCaseProvider,
  DeclineOrderUseCaseProvider,
} from './tailor.providers';
import { CommonModule } from '../common/common.module';
import { TailorController } from './tailor.controller';

@Module({
  imports: [CommonModule],
  controllers: [TailorController],
  providers: [
    TailorRepositoryProvider,
    AcceptOrderUseCaseProvider,
    DeclineOrderUseCaseProvider,
  ],
  exports: [],
})
export class TailorModule {}
