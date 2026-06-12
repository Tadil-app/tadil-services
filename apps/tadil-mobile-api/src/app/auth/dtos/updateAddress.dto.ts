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

  @ApiProperty({ example: 'জেদ্দহ', required: false })
  @IsOptional()
  @IsString()
  cityNameBn?: string;

  @ApiProperty({ example: 'जॆद्दह', required: false })
  @IsOptional()
  @IsString()
  cityNameHi?: string;

  @ApiProperty({ example: 'جدہ', required: false })
  @IsOptional()
  @IsString()
  cityNameUr?: string;

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

  @ApiProperty({ example: 'অল রওদহ', required: false })
  @IsOptional()
  @IsString()
  districtNameBn?: string;

  @ApiProperty({ example: 'अल रौदह', required: false })
  @IsOptional()
  @IsString()
  districtNameHi?: string;

  @ApiProperty({ example: 'الروضہ', required: false })
  @IsOptional()
  @IsString()
  districtNameUr?: string;

  @ApiProperty({ example: 'King St', required: false })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ example: 'شارع الملك', required: false })
  @IsOptional()
  @IsString()
  streetAr?: string;

  @ApiProperty({ example: 'King St', required: false })
  @IsOptional()
  @IsString()
  streetEn?: string;

  @ApiProperty({ example: 'কিং রোড', required: false })
  @IsOptional()
  @IsString()
  streetBn?: string;

  @ApiProperty({ example: 'किंग रोड', required: false })
  @IsOptional()
  @IsString()
  streetHi?: string;

  @ApiProperty({ example: 'کنگ اسٹریٹ', required: false })
  @IsOptional()
  @IsString()
  streetUr?: string;

  @ApiProperty({ example: 21.5433, required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: 39.1728, required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
