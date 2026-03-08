import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ type: String, isArray: true })
  alterations!: string[];
}

export class Point {
  @ApiProperty()
  x!: number;
  @ApiProperty()
  y!: number;
}