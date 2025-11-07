import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateModelUseCase } from '@tadil-models';
import { CreateModelDTO, DisplayModelDTO } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotFoundException, ReadableFile } from '@tadil-common';
import { cleanupLocalFile, fileUploadLocalPath } from '../utils';
import { DataReader } from '@tadil-database';

@Controller('models')
@ApiTags('Models')
export class ModelsController {
  constructor(
    private readonly _createModelUseCase: CreateModelUseCase,
    private readonly _dataReader: DataReader
  ) {}

  @Get('/')
  @ApiOkResponse({ type: DisplayModelDTO, isArray: true })
  async getModels(): Promise<DisplayModelDTO[]> {
    const models = await this._dataReader.queries.model.findMany({
      include: { sections: true },
    });
    return models;
  }

  @Get('/:id')
  @ApiOkResponse({ type: DisplayModelDTO, isArray: false })
  async getModelById(@Param('id') id: string): Promise<DisplayModelDTO> {
    const model = await this._dataReader.queries.model.findUnique({
      where: { id },
      include: { sections: true },
    });

    if (!model) throw new NotFoundException(`Model with id ${id} not found`);
    return model;
  }

  @Post('/create')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        englishName: { type: 'string' },
        arabicName: { type: 'string' },
        hindiName: { type: 'string' },
        urduName: { type: 'string' },
        bengaliName: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', fileUploadLocalPath))
  async createModel(
    @UploadedFile() file: Express.Multer.File,
    @Body() model: CreateModelDTO
  ): Promise<void> {
    try {
      const imageFile: ReadableFile = {
        path: file.path,
        mimetype: file.mimetype,
        originalName: file.originalname,
        size: file.size,
      };

      await this._createModelUseCase.execute({ ...model, imageFile });
      return;
    } finally {
      cleanupLocalFile(file.path);
    }
  }
}
