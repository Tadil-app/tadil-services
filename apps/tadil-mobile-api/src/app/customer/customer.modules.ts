import { Module } from '@nestjs/common';
import {
  AlterationsRepositoryProvider,
  ConfirmReceiptUseCaseProvider,
  CustomerRepositoryProvider,
  InformationsRepositoryProvider,
  ModelsRepositoryProvider,
  OrdersRepositoryProvider,
  CreateOrderUseCaseProvider,
  PaymentGatewayProvider,
  ReconcilePendingOrderUseCaseProvider,
  ConfirmPaymentUseCaseProvider,
  UsersRepositoryProvider,
  WalletRepositoryProvider,
  CreditOrderEarningUseCaseProvider,
} from './customer.providers';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { CustomerController } from './customer.controller';

@Module({
  imports: [CommonModule, AuthModule],
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
    PaymentGatewayProvider,
    ReconcilePendingOrderUseCaseProvider,
    ConfirmPaymentUseCaseProvider,
    CreditOrderEarningUseCaseProvider,
  ],
  exports: [],
})
export class CustomerModule {}
