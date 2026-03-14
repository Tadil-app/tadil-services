import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: '+966500000000', description: 'User phone number' })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code sent to phone' })
  @IsNotEmpty()
  @Length(6, 6)
  code!: string;
}
