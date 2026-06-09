import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ModelsModule } from './models/models.module';
import { InformationsModule } from './informations/informations.module';
import { AlterationsModule } from './alterations/alterations.module';
import { ExtrasModule } from './extras/extras.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { LocationsModule } from './locations/locations.module';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { KeycloakAuthGuard } from './auth/guards/keycloak.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    CommonModule,
    ModelsModule,
    InformationsModule,
    AlterationsModule,
    ExtrasModule,
    UsersModule,
    OrdersModule,
    LocationsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: KeycloakAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
