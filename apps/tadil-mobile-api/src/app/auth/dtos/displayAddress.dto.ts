import { ApiProperty } from '@nestjs/swagger';

export class DisplayAddressDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ required: false, nullable: true, type: Number })
  cityId?: number | null;

  @ApiProperty()
  cityNameAr!: string;

  @ApiProperty()
  cityNameEn!: string;

  @ApiProperty({ required: false, nullable: true })
  districtId?: string | null;

  @ApiProperty({ required: false })
  districtNameAr?: string;

  @ApiProperty({ required: false })
  districtNameEn?: string;

  @ApiProperty({ required: false })
  street?: string;

  @ApiProperty({ required: false, nullable: true, type: Number })
  latitude?: number | null;

  @ApiProperty({ required: false, nullable: true, type: Number })
  longitude?: number | null;

  @ApiProperty()
  userId!: string;
}
