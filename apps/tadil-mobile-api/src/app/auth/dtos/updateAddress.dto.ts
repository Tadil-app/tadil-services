import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty({ example: 'Jeddah', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'King St', required: false })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ example: 'Al Rawdah', required: false })
  @IsOptional()
  @IsString()
  district?: string;
}
