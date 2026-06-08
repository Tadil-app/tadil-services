import { ApiProperty } from '@nestjs/swagger';

export class DisplayDistrictDTO {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  cityId!: number;
  @ApiProperty()
  arabicName!: string;
  @ApiProperty()
  englishName!: string;
}
