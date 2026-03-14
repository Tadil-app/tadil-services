import { ApiProperty } from '@nestjs/swagger';
import { type RoleType } from '@tadil-users';

class UserDto {
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
  @ApiProperty()
  email?: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'Persistent JWT access token' })
  token!: string;

  @ApiProperty({ type: UserDto })
  user!: UserDto;
}
