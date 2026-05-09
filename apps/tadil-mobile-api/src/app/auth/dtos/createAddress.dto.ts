import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 'Riyadh' })
  @IsNotEmpty()
  @IsString()
  city!: string;

  @ApiProperty({ example: 'Olaya St', required: false })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ example: 'Al Olaya', required: false })
  @IsOptional()
  @IsString()
  district?: string;
}
