import { ApiProperty } from '@nestjs/swagger';
import { DisplayOrderDto } from './displayOrder.dto';

export class PaginatedOrdersDto {
  @ApiProperty({ type: DisplayOrderDto, isArray: true })
  data!: DisplayOrderDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;
}
