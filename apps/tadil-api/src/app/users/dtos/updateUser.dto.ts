import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  firstName!: string;
  @ApiProperty()
  @IsNotEmpty()
  lastName!: string;
  @ApiProperty()
  @IsNotEmpty()
  phone!: string;
  @ApiProperty()
  @IsOptional()
  email?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  commissionRate?: number;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;
}
