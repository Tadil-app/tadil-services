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
  CreateAlterationUseCase,
  UpdateAlterationUseCase,
  DeleteAlterationUseCase,
} from '@tadil-alterations';
import {
  CreateAlterationDTO,
  DisplayAlterationDTO,
  UpdateAlterationDTO,
} from './dtos';

@Controller('alterations')
@ApiTags('Alterations')
export class AlterationsController {
  constructor(
    private readonly _createAlterationUseCase: CreateAlterationUseCase,
    private readonly _updateAlterationUseCase: UpdateAlterationUseCase,
    private readonly _deleteAlterationUseCase: DeleteAlterationUseCase,
    private readonly _dataReader: DataReader
  ) {}

  @Get('/')
  @ApiOkResponse({ type: DisplayAlterationDTO, isArray: true })
  async getAlterations(): Promise<DisplayAlterationDTO[]> {
    const alterations = await this._dataReader.queries.alteration.findMany({
      include: {
        sections: { select: { id: true } },
        informations: { select: { id: true } },
        extras: { select: { id: true } },
      },
    });
    return alterations.map((alteration) => ({
      ...alteration,
      sections: alteration.sections.map((section) => section.id),
      informations: alteration.informations.map(
        (informations) => informations.id
      ),
      extras: alteration.extras.map((extras) => extras.id),
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
      include: {
        sections: { select: { id: true } },
        informations: { select: { id: true } },
        extras: { select: { id: true } },
      },
    });

    if (!alteration)
      throw new NotFoundException(`Alteration with id ${id} not found`);
    return {
      ...alteration,
      sections: alteration.sections.map((section) => section.id),
      informations: alteration.informations.map(
        (informations) => informations.id
      ),
      extras: alteration.extras.map((extras) => extras.id),
    };
  }

  @Post('/create')
  async createAlteration(
    @Body() alteration: CreateAlterationDTO
  ): Promise<void> {
    await this._createAlterationUseCase.execute(alteration);
  }

  @Put('/update/:id')
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
