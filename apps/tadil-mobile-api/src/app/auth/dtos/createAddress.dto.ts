import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsNumber()
  cityId?: number;

  @ApiProperty({ example: 'الرياض' })
  @IsNotEmpty()
  @IsString()
  cityNameAr!: string;

  @ApiProperty({ example: 'Riyadh' })
  @IsNotEmpty()
  @IsString()
  cityNameEn!: string;

  @ApiProperty({ example: 'রিয়ধ' })
  @IsNotEmpty()
  @IsString()
  cityNameBn!: string;

  @ApiProperty({ example: 'रियध' })
  @IsNotEmpty()
  @IsString()
  cityNameHi!: string;

  @ApiProperty({ example: 'الریاض' })
  @IsNotEmpty()
  @IsString()
  cityNameUr!: string;

  @ApiProperty({ example: '10100003001', required: false })
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiProperty({ example: 'العليا', required: false })
  @IsOptional()
  @IsString()
  districtNameAr?: string;

  @ApiProperty({ example: 'Al Olaya', required: false })
  @IsOptional()
  @IsString()
  districtNameEn?: string;

  @ApiProperty({ example: 'অল অলয়', required: false })
  @IsOptional()
  @IsString()
  districtNameBn?: string;

  @ApiProperty({ example: 'अल अलय', required: false })
  @IsOptional()
  @IsString()
  districtNameHi?: string;

  @ApiProperty({ example: 'العلیا', required: false })
  @IsOptional()
  @IsString()
  districtNameUr?: string;

  @ApiProperty({ example: 'Olaya St', required: false })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ example: 'شارع العليا', required: false })
  @IsOptional()
  @IsString()
  streetAr?: string;

  @ApiProperty({ example: 'Olaya St', required: false })
  @IsOptional()
  @IsString()
  streetEn?: string;

  @ApiProperty({ example: 'ওলায়া রোড', required: false })
  @IsOptional()
  @IsString()
  streetBn?: string;

  @ApiProperty({ example: 'ओलाया रोड', required: false })
  @IsOptional()
  @IsString()
  streetHi?: string;

  @ApiProperty({ example: 'العلیا اسٹریٹ', required: false })
  @IsOptional()
  @IsString()
  streetUr?: string;

  @ApiProperty({ example: 24.7136 })
  @IsNotEmpty()
  @IsNumber()
  latitude!: number;

  @ApiProperty({ example: 46.6753 })
  @IsNotEmpty()
  @IsNumber()
  longitude!: number;
}
