import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { DataReader } from '@tadil-database';
import {
  CreateExtraUseCase,
  UpdateExtraUseCase,
  DeleteExtraUseCase,
} from '@tadil-extras';
import { CreateExtraDTO, DisplayExtraDTO, UpdateExtraDTO } from './dtos';

@Controller('extras')
@ApiTags('Extras')
export class ExtrasController {
  constructor(
    private readonly _createExtraUseCase: CreateExtraUseCase,
    private readonly _updateExtraUseCase: UpdateExtraUseCase,
    private readonly _deleteExtraUseCase: DeleteExtraUseCase,
    private readonly _dataReader: DataReader
  ) {}

  @Get('/')
  @ApiOkResponse({ type: DisplayExtraDTO, isArray: true })
  async getExtras(): Promise<DisplayExtraDTO[]> {
    const extras = await this._dataReader.queries.extra.findMany();
    return extras;
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({ type: DisplayExtraDTO })
  async getExtraById(@Param('id') id: string): Promise<DisplayExtraDTO> {
    const extra = await this._dataReader.queries.extra.findUnique({
      where: { id },
      
    });

    if (!extra)
      throw new NotFoundException(`Extra with id ${id} not found`);
    return extra;
  }

  @Post('/create')
  async createExtra(@Body() extra: CreateExtraDTO): Promise<void> {
    await this._createExtraUseCase.execute(extra);
  }

  @Put('/update/:id')
  @ApiParam({ name: 'id', type: 'string' })
  async updateExtra(
    @Param('id') id: string,
    @Body() extra: UpdateExtraDTO
  ): Promise<void> {
    await this._updateExtraUseCase.execute({ ...extra, id });
  }

  @Delete('/delete/:id')
  @ApiParam({ name: 'id', type: 'string' })
  async deleteExtra(@Param('id') id: string): Promise<void> {
    await this._deleteExtraUseCase.execute({ extraId: id });
  }
}
