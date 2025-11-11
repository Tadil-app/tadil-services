import { Module } from '@nestjs/common';
import { ModelsModule } from './models/models.module';
import { InformationsModule } from './informations/informations.module';
import { AlterationsModule } from './alterations/alterations.module';

@Module({
  imports: [ModelsModule, InformationsModule, AlterationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
