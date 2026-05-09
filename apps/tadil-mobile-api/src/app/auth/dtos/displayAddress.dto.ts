import { ApiProperty } from '@nestjs/swagger';

export class DisplayAddressDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty({ required: false })
  street?: string;

  @ApiProperty({ required: false })
  district?: string;

  @ApiProperty()
  userId!: string;
}
