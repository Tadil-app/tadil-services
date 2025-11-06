import { Module } from '@nestjs/common';
import { SectionsModule } from './sections/sections.module';

@Module({
  imports: [SectionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
