import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Point } from '.';

export class AddSectionDTO {
  @ApiProperty()
  @IsNotEmpty()
  modelId!: string;
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
  @ApiProperty({ type: () => Point, isArray: true })
  @IsNotEmpty()
  coordinates!: Point[];
}
