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
  @ApiProperty({ enum: ['authenticated', 'signup_required', 'pending', 'rejected'] })
  status!: string;

  @ApiProperty({ required: false, description: 'JWT access token (only if authenticated)' })
  token?: string;

  @ApiProperty({ type: UserDto, required: false })
  user?: UserDto;

  @ApiProperty({ required: false })
  message?: string;
}
