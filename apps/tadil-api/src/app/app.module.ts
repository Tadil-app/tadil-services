import { Module } from '@nestjs/common';
import { ModelsModule } from './models/models.module';
import { AlterationsModule } from './alterations/alterations.module';

@Module({
  imports: [ModelsModule, AlterationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
