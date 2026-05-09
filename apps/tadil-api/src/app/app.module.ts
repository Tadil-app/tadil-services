import { Module } from '@nestjs/common';
import { ModelsModule } from './models/models.module';
import { InformationsModule } from './informations/informations.module';
import { AlterationsModule } from './alterations/alterations.module';
import { ExtrasModule } from './extras/extras.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    CommonModule,
    ModelsModule,
    InformationsModule,
    AlterationsModule,
    ExtrasModule,
    UsersModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
