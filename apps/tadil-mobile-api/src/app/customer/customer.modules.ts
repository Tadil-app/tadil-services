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
    ConfirmReceiptUseCaseProvider,
    CreateOrderUseCaseProvider,
    ConfirmPaymentUseCaseProvider,
  ],
  exports: [],
})
export class CustomerModule {}
