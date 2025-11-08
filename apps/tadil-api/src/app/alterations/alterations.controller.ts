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
import {
  CreateAlterationUseCase,
  UpdateAlterationUseCase,
  DeleteAlterationUseCase,
} from '@tadil-alterations';
import { DataReader } from '@tadil-database';
import {
  CreateAlterationDTO,
  DisplayAlterationDTO,
  UpdateAlterationDTO,
} from './dtos';

@Controller('alterations')
@ApiTags('Alterations')
export class AlterationsController {
  constructor(
    private readonly _dataReader: DataReader,
    private readonly _createAlterationUseCase: CreateAlterationUseCase,
    private readonly _updateAlterationUseCase: UpdateAlterationUseCase,
    private readonly _deleteAlterationUseCase: DeleteAlterationUseCase
  ) {}

  @Get('/')
  @ApiOkResponse({ type: DisplayAlterationDTO, isArray: true })
  async getAlterations(): Promise<DisplayAlterationDTO[]> {
    const alterations = await this._dataReader.queries.alteration.findMany();
    return alterations.map((alteration) => ({
      id: alteration.id,
      englishName: alteration.englishName,
      arabicName: alteration.arabicName,
      hindiName: alteration.hindiName,
      urduName: alteration.urduName,
      bengaliName: alteration.bengaliName,
      value: alteration.value ?? undefined,
      unit: alteration.unit ?? undefined,
    }));
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({ type: DisplayAlterationDTO })
  async getAlterationById(
    @Param('id') id: string
  ): Promise<DisplayAlterationDTO> {
    const alteration = await this._dataReader.queries.alteration.findUnique({
      where: { id },
    });

    if (!alteration)
      throw new NotFoundException(`Alteration with id ${id} not found`);
    return {
      id: alteration.id,
      englishName: alteration.englishName,
      arabicName: alteration.arabicName,
      hindiName: alteration.hindiName,
      urduName: alteration.urduName,
      bengaliName: alteration.bengaliName,
      value: alteration.value ?? undefined,
      unit: alteration.unit ?? undefined,
    };
  }

  @Post('/create')
  async createAlteration(
    @Body() alteration: CreateAlterationDTO
  ): Promise<void> {
    await this._createAlterationUseCase.execute(alteration);
  }

  @Put(':id/update')
  @ApiParam({ name: 'id', type: 'string' })
  async updateAlteration(
    @Param('id') id: string,
    @Body() alteration: UpdateAlterationDTO
  ): Promise<void> {
    await this._updateAlterationUseCase.execute({ ...alteration, id });
  }

  @Delete('/delete/:id')
  @ApiParam({ name: 'id', type: 'string' })
  async deleteAlteration(@Param('id') id: string): Promise<void> {
    await this._deleteAlterationUseCase.execute({ alterationId: id });
  }
}
