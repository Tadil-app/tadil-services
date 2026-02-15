import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.modules';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { TailorModule } from './tailor/tailor.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CommonModule, CustomerModule, TailorModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
