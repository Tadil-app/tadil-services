import { ApiProperty } from '@nestjs/swagger';
import { type RoleType } from '@tadil-users';

export class DisplayUserDTO {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  firstName!: string;
  @ApiProperty()
  lastName!: string;
  @ApiProperty()
  phone!: string;
  @ApiProperty()
  role!: RoleType;
  @ApiProperty({ required: false })
  email?: string;
  @ApiProperty({ required: false })
  commissionRate?: number;
  @ApiProperty({ required: false })
  cityNameAr?: string;
  @ApiProperty({ required: false })
  cityNameEn?: string;
  @ApiProperty({ required: false })
  cityNameBn?: string;
  @ApiProperty({ required: false })
  cityNameHi?: string;
  @ApiProperty({ required: false })
  cityNameUr?: string;
  @ApiProperty({ required: false })
  cityId?: number;
  @ApiProperty({ required: false })
  districtId?: string;
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
  @ApiProperty({ required: false })
  latitude?: number;
  @ApiProperty({ required: false })
  longitude?: number;
}
