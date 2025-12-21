import { Module } from '@nestjs/common';
import {
  AlterationsRepositoryProvider,
  InformationsRepositoryProvider,
  ModelsRepositoryProvider,
} from './customer.providers';
import { CommonModule } from '../common/common.module';
import { CustomerController } from './customer.controller';

@Module({
  imports: [CommonModule],
  controllers: [CustomerController],
  providers: [
    ModelsRepositoryProvider,
    AlterationsRepositoryProvider,
    InformationsRepositoryProvider,
  ],
  exports: [],
})
export class CustomerModule {}
