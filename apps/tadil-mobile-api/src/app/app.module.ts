import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.modules';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { TailorModule } from './tailor/tailor.module';
import { CourierModule } from './courier/courier.module';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { ChatModule } from './chat/chat.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [CommonModule, CustomerModule, TailorModule, CourierModule, AuthModule, WalletModule, ChatModule, LocationsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
