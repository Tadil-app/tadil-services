import { ApiProperty } from '@nestjs/swagger';

export * from './displayModel.dto';
export * from './createModel.dto';
export * from './displaySection.dto';
export * from './createSection.dto';

export class Point {
  @ApiProperty()
  x!: number;
  @ApiProperty()
  y!: number;
}
