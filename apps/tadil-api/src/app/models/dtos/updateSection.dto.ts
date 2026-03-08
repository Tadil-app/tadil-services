import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Point } from '.';

export class UpdateSectionDTO {
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
  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  alterations!: string[];
}
