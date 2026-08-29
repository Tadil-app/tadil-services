import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateSortingDTO {
  @ApiProperty()
  @IsInt()
  sorting!: number;
}
