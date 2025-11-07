import { Module } from '@nestjs/common';
import { SectionsModule } from './sections/sections.module';
import { ModelsModule } from './models/models.module';

@Module({
  imports: [SectionsModule, ModelsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
