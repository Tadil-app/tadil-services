import { ApiProperty } from '@nestjs/swagger';

export class DisplayModelImageDTO {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  imageUrl!: string;
  @ApiProperty({ type: () => DisplaySectionDTO, isArray: true })
  sections!: DisplaySectionDTO[];
}

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

export class Point {
  @ApiProperty()
  x!: number;
  @ApiProperty()
  y!: number;
}
