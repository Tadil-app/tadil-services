import { Module } from '@nestjs/common';
import { ModelsModule } from './models/models.module';
import { AlterationsModule } from './alterations/alterations.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [ModelsModule, AlterationsModule, ServicesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
