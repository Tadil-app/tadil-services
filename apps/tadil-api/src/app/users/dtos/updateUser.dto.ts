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
  // Legacy free-text city, kept for backward compatibility. Prefer the
  // structured address fields below.
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  // --- Structured address (same shape as the customer address flow) ---
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  cityId?: number;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cityNameAr?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cityNameEn?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cityNameBn?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cityNameHi?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cityNameUr?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  districtId?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  districtNameAr?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  districtNameEn?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  districtNameBn?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  districtNameHi?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  districtNameUr?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  street?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  streetAr?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  streetEn?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  streetBn?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  streetHi?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  streetUr?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
