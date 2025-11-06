import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { SectionsModule } from './sections/sections.module';

@Module({
  imports: [
    SectionsModule,
    RouterModule.register([
      {
        path: 'sections',
        module: SectionsModule,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
