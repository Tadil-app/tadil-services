import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { OrdersController } from './orders.controller';
import {
  OrdersRepositoryProvider,
  AssignTailorManuallyUseCaseProvider,
} from './orders.providers';

@Module({
  imports: [CommonModule],
  controllers: [OrdersController],
  providers: [
    OrdersRepositoryProvider,
    AssignTailorManuallyUseCaseProvider,
  ],
})
export class OrdersModule {}
