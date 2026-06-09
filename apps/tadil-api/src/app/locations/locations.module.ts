import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { LocationsController } from './locations.controller';

@Module({
  imports: [CommonModule],
  controllers: [LocationsController],
  providers: [],
  exports: [],
})
export class LocationsModule {}
