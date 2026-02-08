import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.modules';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { TailorModule } from './tailor/tailor.module';

@Module({
  imports: [CommonModule, CustomerModule, TailorModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
