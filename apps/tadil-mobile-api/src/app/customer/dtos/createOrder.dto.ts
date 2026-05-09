import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  addressId!: string;

  @ApiProperty()
  @IsArray()
  items!: any[];

  @ApiProperty()
  @IsArray()
  customItems!: any[];
}
