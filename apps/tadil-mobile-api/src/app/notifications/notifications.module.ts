import { Global, Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { DevicesController } from './devices.controller';
import { DeviceTokensProvider, OrderNotifierProvider, PushSenderProvider } from './notifications.providers';

/** Global so any controller that moves an order can announce it. */
@Global()
@Module({
  imports: [CommonModule, AuthModule],
  controllers: [DevicesController],
  providers: [PushSenderProvider, OrderNotifierProvider, DeviceTokensProvider],
  exports: [OrderNotifierProvider],
})
export class NotificationsModule {}
