import { Provider } from '@nestjs/common';
import { DbClient } from '@tadil-database';
import { createPushSender, DeviceTokens, OrderNotifier, PushSender } from '@tadil-notifications';

export const PUSH_SENDER = 'PushSender';

export const PushSenderProvider: Provider<PushSender> = {
  provide: PUSH_SENDER,
  useFactory: () => createPushSender(),
};

export const OrderNotifierProvider: Provider<OrderNotifier> = {
  provide: OrderNotifier,
  useFactory: (db: DbClient, sender: PushSender) => new OrderNotifier(db, sender),
  inject: [DbClient, PUSH_SENDER],
};

export const DeviceTokensProvider: Provider<DeviceTokens> = {
  provide: DeviceTokens,
  useFactory: (db: DbClient) => new DeviceTokens(db),
  inject: [DbClient],
};
