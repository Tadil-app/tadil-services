import { Module } from '@nestjs/common';
import { ModelsModule } from './models/models.module';
import { InformationsModule } from './informations/informations.module';
import { AlterationsModule } from './alterations/alterations.module';
import { ExtrasModule } from './extras/extras.module';

@Module({
  imports: [ModelsModule, InformationsModule, AlterationsModule, ExtrasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
