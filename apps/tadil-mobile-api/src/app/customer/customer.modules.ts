import { Module } from '@nestjs/common';
import {
  AlterationsRepositoryProvider,
  ConfirmReceiptUseCaseProvider,
  CustomerRepositoryProvider,
  InformationsRepositoryProvider,
  ModelsRepositoryProvider,
  OrdersRepositoryProvider,
  CreateOrderUseCaseProvider,
  ConfirmPaymentUseCaseProvider,
  UsersRepositoryProvider,
  WalletRepositoryProvider,
  CreditOrderEarningUseCaseProvider,
} from './customer.providers';
import { CommonModule } from '../common/common.module';
import { CustomerController } from './customer.controller';

@Module({
  imports: [CommonModule],
  controllers: [CustomerController],
  providers: [
    CustomerRepositoryProvider,
    ModelsRepositoryProvider,
    AlterationsRepositoryProvider,
    InformationsRepositoryProvider,
    OrdersRepositoryProvider,
    UsersRepositoryProvider,
    WalletRepositoryProvider,
    ConfirmReceiptUseCaseProvider,
    CreateOrderUseCaseProvider,
    ConfirmPaymentUseCaseProvider,
    CreditOrderEarningUseCaseProvider,
  ],
  exports: [],
})
export class CustomerModule {}
