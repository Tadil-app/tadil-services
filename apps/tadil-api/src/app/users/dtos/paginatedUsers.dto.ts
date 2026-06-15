import { ApiProperty } from '@nestjs/swagger';
import { DisplayUserDTO } from './displayUser.dto';

export class PaginatedUsersDTO {
  @ApiProperty({ type: DisplayUserDTO, isArray: true })
  data!: DisplayUserDTO[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;
}
