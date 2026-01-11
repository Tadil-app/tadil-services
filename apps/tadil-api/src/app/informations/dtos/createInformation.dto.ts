import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { InformationType } from '.';

export class CreateInformationDTO {
  @ApiProperty()
  @IsNotEmpty()
  englishName!: string;
  @ApiProperty()
  @IsNotEmpty()
  arabicName!: string;
  @ApiProperty()
  @IsNotEmpty()
  hindiName!: string;
  @ApiProperty()
  @IsNotEmpty()
  urduName!: string;
  @ApiProperty()
  @IsNotEmpty()
  bengaliName!: string;
  @ApiProperty()
  @IsNotEmpty()
  isRequired!: boolean;
  @ApiProperty({ enum: InformationType, enumName: 'InformationType' })
  @IsNotEmpty()
  type!: InformationType;
  @ApiProperty()
  @IsOptional()
  unit?: string;
  @ApiProperty({ type: String, isArray: true })
  @IsNotEmpty()
  extras!: string[];
}
