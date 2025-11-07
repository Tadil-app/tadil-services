import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { DisplaySectionDTO } from '.';

export class DisplayModelDTO {
  @ApiProperty()
  @IsNotEmpty()
  id!: string;
  @ApiProperty()
  @IsNotEmpty()
  imageFileId!: string;
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
  sections!: DisplaySectionDTO[];
}
