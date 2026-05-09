import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class RequestPayoutDto {
  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount!: number;
}
