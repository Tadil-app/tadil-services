import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty({ example: '+966500000000', description: 'User phone number in international format' })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone!: string;
}
