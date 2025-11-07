import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateModelUseCase } from '@tadil-models';
import { CreateModelDTO } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReadableFile } from '@tadil-common';
import { promises } from 'fs';
import { fileUploadLocalPath } from '../utils';

@Controller('models')
@ApiTags('Models')
export class ModelsController {
  constructor(private readonly _createModelUseCase: CreateModelUseCase) {}

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
