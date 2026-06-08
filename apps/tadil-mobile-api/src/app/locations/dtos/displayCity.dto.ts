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
}
