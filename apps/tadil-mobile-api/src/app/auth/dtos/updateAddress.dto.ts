import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty({ example: 17, required: false })
  @IsOptional()
  @IsNumber()
  cityId?: number;

  @ApiProperty({ example: 'جدة', required: false })
  @IsOptional()
  @IsString()
  cityNameAr?: string;

  @ApiProperty({ example: 'Jeddah', required: false })
  @IsOptional()
  @IsString()
  cityNameEn?: string;

  @ApiProperty({ example: '21000005001', required: false })
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiProperty({ example: 'الروضة', required: false })
  @IsOptional()
  @IsString()
  districtNameAr?: string;

  @ApiProperty({ example: 'Al Rawdah', required: false })
  @IsOptional()
  @IsString()
  districtNameEn?: string;

  @ApiProperty({ example: 'King St', required: false })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ example: 21.5433, required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: 39.1728, required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
