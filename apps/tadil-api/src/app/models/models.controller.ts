import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateModelUseCase } from '@tadil-models';
import { CreateModelDTO, DisplayModelDTO } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReadableFile } from '@tadil-common';
import { promises } from 'fs';
import { fileUploadLocalPath } from '../utils';
import { DataReader } from '@tadil-database';

@Controller('models')
@ApiTags('Models')
export class ModelsController {
  constructor(
    private readonly _createModelUseCase: CreateModelUseCase,
    private readonly _dataReaer: DataReader
  ) {}

  @Get('/')
  async getModels(): Promise<DisplayModelDTO[]> {
    const models = await this._dataReaer.queries.model.findMany({
      include: { sections: true },
    });
    return models;
  }

  @Get('/:id')
  async getModelById(
    @Param('id') id: string
  ): Promise<DisplayModelDTO | undefined> {
    const model = await this._dataReaer.queries.model.findUnique({
      where: { id },
      include: { sections: true },
    });

    if (!model) return undefined;
    return model;
  }

  @Post('/create')
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
      try {
        await promises.unlink(file.path);
      } catch (cleanupError: any) {
        if (cleanupError.code !== 'ENOENT')
          console.error(
            `Failed to delete temporary file ${file.path}:`,
            cleanupError
          );
      }
    }
  }
}
