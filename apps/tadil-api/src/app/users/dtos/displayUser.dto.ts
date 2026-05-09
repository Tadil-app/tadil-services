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
  city?: string;
}
