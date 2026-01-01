import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateAlterationDTO {
  @ApiProperty()
  @IsNotEmpty()
  englishName!: string;
  @ApiProperty()
  @IsNotEmpty()
  arabicName!: string;
  @ApiProperty()
  @IsNotEmpty()
  urduName!: string;
  @ApiProperty()
  @IsNotEmpty()
  hindiName!: string;
  @ApiProperty()
  @IsNotEmpty()
  bengaliName!: string;
  @ApiProperty()
  @IsNotEmpty()
  price!: number;
  @ApiProperty({ type: String, isArray: true })
  @IsNotEmpty()
  sections!: string[];
  @ApiProperty({ type: String, isArray: true })
  @IsNotEmpty()
  informations!: string[];
  @ApiProperty({ type: String, isArray: true })
  @IsNotEmpty()
  extras!: string[];
}
