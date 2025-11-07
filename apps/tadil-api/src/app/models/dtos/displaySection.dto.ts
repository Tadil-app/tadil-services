import { ApiProperty } from '@nestjs/swagger';
import { Point } from '.';

export class DisplaySectionDTO {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  englishName!: string;
  @ApiProperty()
  arabicName!: string;
  @ApiProperty()
  hindiName!: string;
  @ApiProperty()
  urduName!: string;
  @ApiProperty()
  bengaliName!: string;
  @ApiProperty({ type: () => Point, isArray: true })
  coordinates!: Point[];
}
