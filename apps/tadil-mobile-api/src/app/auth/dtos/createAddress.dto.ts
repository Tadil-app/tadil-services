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

  @ApiProperty({ example: 'Olaya St', required: false })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ example: 24.7136, required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: 46.6753, required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
