import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  firstName!: string;
  @ApiProperty()
  @IsNotEmpty()
  lastName!: string;
  @ApiProperty()
  @IsNotEmpty()
  phone!: string;
  @ApiProperty()
  @IsOptional()
  email?: string;
}
