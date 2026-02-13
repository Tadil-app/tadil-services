import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDTO {
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
