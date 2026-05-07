import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '+1234567890', description: 'Phone number in international format' })
  @IsNotEmpty()
  @IsString()
  phone!: string;
}
