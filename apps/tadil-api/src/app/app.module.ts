import { Module } from '@nestjs/common';
import { ModelsModule } from './models/models.module';
import { InformationsModule } from './informations/informations.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [ModelsModule, InformationsModule, ServicesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
