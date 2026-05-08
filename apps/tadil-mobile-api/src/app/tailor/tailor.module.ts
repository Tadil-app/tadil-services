import { Module } from '@nestjs/common';
import {
  TailorRepositoryProvider,
  AcceptOrderUseCaseProvider,
  DeclineOrderUseCaseProvider,
  ConfirmReceiptUseCaseProvider,
  MarkOrderReadyUseCaseProvider,
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
    ConfirmReceiptUseCaseProvider,
    MarkOrderReadyUseCaseProvider,
  ],
  exports: [],
})
export class TailorModule {}
