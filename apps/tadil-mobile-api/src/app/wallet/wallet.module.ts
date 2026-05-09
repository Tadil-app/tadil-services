import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { WalletController } from './wallet.controller';
import {
  WalletRepositoryProvider,
  GetWalletDetailsUseCaseProvider,
  RequestPayoutUseCaseProvider,
  FulfillPayoutUseCaseProvider,
  RejectPayoutUseCaseProvider,
  CreditOrderEarningUseCaseProvider,
} from '../common/wallet.providers';

@Module({
  imports: [CommonModule],
  controllers: [WalletController],
  providers: [
    WalletRepositoryProvider,
    GetWalletDetailsUseCaseProvider,
    RequestPayoutUseCaseProvider,
    FulfillPayoutUseCaseProvider,
    RejectPayoutUseCaseProvider,
    CreditOrderEarningUseCaseProvider,
  ],
  exports: [
    GetWalletDetailsUseCaseProvider,
    CreditOrderEarningUseCaseProvider,
  ],
})
export class WalletModule {}
