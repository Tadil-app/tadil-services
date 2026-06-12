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

  @ApiProperty()
  cityNameBn!: string;

  @ApiProperty()
  cityNameHi!: string;

  @ApiProperty()
  cityNameUr!: string;

  @ApiProperty({ required: false, nullable: true })
  districtId?: string | null;

  @ApiProperty({ required: false })
  districtNameAr?: string;

  @ApiProperty({ required: false })
  districtNameEn?: string;

  @ApiProperty({ required: false })
  districtNameBn?: string;

  @ApiProperty({ required: false })
  districtNameHi?: string;

  @ApiProperty({ required: false })
  districtNameUr?: string;

  @ApiProperty({ required: false })
  street?: string;

  @ApiProperty({ required: false })
  streetAr?: string;

  @ApiProperty({ required: false })
  streetEn?: string;

  @ApiProperty({ required: false })
  streetBn?: string;

  @ApiProperty({ required: false })
  streetHi?: string;

  @ApiProperty({ required: false })
  streetUr?: string;

  @ApiProperty({ required: false, nullable: true, type: Number })
  latitude?: number | null;

  @ApiProperty({ required: false, nullable: true, type: Number })
  longitude?: number | null;

  @ApiProperty()
  userId!: string;
}
