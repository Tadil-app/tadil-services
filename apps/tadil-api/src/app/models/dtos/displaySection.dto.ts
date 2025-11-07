import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Point {
  @ApiProperty()
  x!: number;
  @ApiProperty()
  y!: number;
}

export class DisplaySectionDTO {
  @ApiProperty()
  @IsNotEmpty()
  id!: string;
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
