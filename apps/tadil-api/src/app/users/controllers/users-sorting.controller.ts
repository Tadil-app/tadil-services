import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { DataReader } from '@tadil-database';
import { UpdateSortingDTO } from '../dtos';

@Controller('users')
@ApiTags('Users')
export class UsersSortingController {
  constructor(private readonly _dataReader: DataReader) {}

  @Patch('/:id/sorting')
  @ApiParam({ name: 'id', type: 'string' })
  async updateSorting(
    @Param('id') id: string,
    @Body() body: UpdateSortingDTO
  ): Promise<void> {
    const user = await this._dataReader.queries.user.findUnique({
      where: { id },
      select: { role: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const users = await this._dataReader.queries.user.findMany({
      where: { role: user.role },
      orderBy: [{ sorting: 'asc' }, { id: 'asc' }],
      select: { id: true },
    });
    const position = Number(body.sorting);
    if (!Number.isInteger(position) || position < 1 || position > users.length) {
      throw new BadRequestException(
        `Sorting must be between 1 and ${users.length}`
      );
    }

    const currentIndex = users.findIndex((item) => item.id === id);
    const [moved] = users.splice(currentIndex, 1);
    users.splice(position - 1, 0, moved!);
    // ponytail: O(n) writes keep role-scoped positions contiguous; use range updates if user lists become large.
    await this._dataReader.queries.$transaction(
      users.map((item, index) =>
        this._dataReader.queries.user.update({
          where: { id: item.id },
          data: { sorting: index + 1 },
        })
      )
    );
  }
}
