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
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { ReadableFile } from '@tadil-common';
import { promises } from 'fs';
import { extname } from 'path';
import { filterImageFiles } from '../utils';

@Controller('models')
@ApiTags('Models')
export class ModelsController {
  constructor(private readonly _createModelUseCase: CreateModelUseCase) {}

  @Post('/create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const fileExtension = extname(file.originalname);
          cb(null, uuidv4() + fileExtension);
        },
      }),
      fileFilter: filterImageFiles,
    })
  )
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
      } catch (cleanupError) {
        console.error(
          `Failed to delete temporary file ${file.path}:`,
          cleanupError
        );
      }
    }
  }
}
