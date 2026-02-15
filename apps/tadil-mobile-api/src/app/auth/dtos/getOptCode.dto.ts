import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetOtpCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  phone!: string;
}
