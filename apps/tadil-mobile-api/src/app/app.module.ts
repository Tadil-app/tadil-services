import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.modules';

@Module({
  imports: [CustomerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
