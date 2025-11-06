import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DataReader } from '@tadil-database';
import {
  CreateSectionUseCase,
  DeleteSectionUseCase,
  UpdateSectionUseCase,
} from '@tadil-sections';
import { CreateSectionDTO, DisplaySectionDTO, UpdateSectionDTO } from './dtos';

@Controller('sections')
@ApiTags('sections')
export class SectionsController {
  constructor(
    private readonly _createSectionUseCase: CreateSectionUseCase,
    private readonly _updateSectionUseCase: UpdateSectionUseCase,
    private readonly _deleteSectionUseCase: DeleteSectionUseCase,
    private readonly _dataReaer: DataReader
  ) {}

  @Get('/')
  @ApiOkResponse({ type: DisplaySectionDTO, isArray: true })
  async getSections(): Promise<DisplaySectionDTO[]> {
    const sections = await this._dataReaer.queries.section.findMany();
    return sections;
  }

  @Get('/:id')
  @ApiOkResponse({ type: DisplaySectionDTO })
  async getSectionById(
    @Param('id') id: string
  ): Promise<DisplaySectionDTO | null> {
    const section = await this._dataReaer.queries.section.findUnique({
      where: {
        id,
      },
    });
    return section;
  }

  @Post('/create')
  async createSection(@Body() section: CreateSectionDTO): Promise<void> {
    await this._createSectionUseCase.execute(section);
    return;
  }

  @Put('/update/:id')
  async updateSection(
    @Param('id') id: string,
    @Body() section: UpdateSectionDTO
  ): Promise<void> {
    await this._updateSectionUseCase.execute({ id: id, ...section });
    return;
  }

  @Delete('/delete/:id')
  async deleteSection(@Param('id') id: string): Promise<void> {
    await this._deleteSectionUseCase.execute({ sectionId: id });
    return;
  }
}
