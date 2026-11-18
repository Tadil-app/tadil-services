import { Module } from '@nestjs/common';
import { CommonModule } from '../common.module';
import { WaybillController } from './waybill.controller';

@Module({
  imports: [CommonModule],
  controllers: [WaybillController],
})
export class WaybillModule {}
