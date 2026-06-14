import { ApiProperty } from '@nestjs/swagger';

export class DisplayCityDTO {
  @ApiProperty()
  id!: number;
  @ApiProperty()
  regionId!: number;
  @ApiProperty()
  arabicName!: string;
  @ApiProperty()
  englishName!: string;
  @ApiProperty()
  bengaliName!: string;
  @ApiProperty()
  hindiName!: string;
  @ApiProperty()
  urduName!: string;
  @ApiProperty({ nullable: true, type: Number })
  lat!: number | null;
  @ApiProperty({ nullable: true, type: Number })
  lng!: number | null;
}
