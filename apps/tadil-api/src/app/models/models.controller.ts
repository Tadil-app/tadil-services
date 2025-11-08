import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  AddSectionUseCase,
  CreateModelUseCase,
  DeleteModelUseCase,
  DeleteSectionUseCase,
} from '@tadil-models';
import { AddSectionDTO, CreateModelDTO, DisplayModelDTO } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  type FileStorageService,
  NotFoundException,
  ReadableFile,
} from '@tadil-common';
import {
  cleanupLocalFile,
  fileUploadLocalPath,
  streamToBase64,
} from '../utils';
import { DataReader } from '@tadil-database';

@Controller('models')
@ApiTags('Models')
export class ModelsController {
  constructor(
    private readonly _dataReader: DataReader,
    private readonly _createModelUseCase: CreateModelUseCase,
    private readonly _deleteModelUseCase: DeleteModelUseCase,
    private readonly _addSectionUseCase: AddSectionUseCase,
    private readonly _deleteSectionUseCase: DeleteSectionUseCase,
    @Inject('FileStorageService')
    private readonly _fileStorageService: FileStorageService
  ) {}

  @Get('/')
  @ApiOkResponse({ type: DisplayModelDTO, isArray: true })
  async getModels(): Promise<DisplayModelDTO[]> {
    const models = await this._dataReader.queries.model.findMany({
      include: { sections: true },
    });
    const modelsWithImages = models.map(async (model) => {
      const imageStream = await this._fileStorageService.downloadFile(
        model.imageFileId
      );
      const imageBase64String = await streamToBase64(imageStream);
      return {
        ...model,
        imageBase64String,
      };
    });
    return await Promise.all(modelsWithImages);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({ type: DisplayModelDTO, isArray: false })
  async getModelById(@Param('id') id: string): Promise<DisplayModelDTO> {
    const model = await this._dataReader.queries.model.findUnique({
      where: { id },
      include: { sections: true },
    });

    if (!model) throw new NotFoundException(`Model with id ${id} not found`);
    const imageStream = await this._fileStorageService.downloadFile(
      model.imageFileId
    );
    const imageBase64String = await streamToBase64(imageStream);
    return {
      ...model,
      imageBase64String,
    };
  }

  @Post('/create')
  @ApiConsumes('multipart/form-data')
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

  @Delete('/delete/:id')
  @ApiParam({ name: 'id', type: 'string' })
  async deleteModel(@Param('id') id: string): Promise<void> {
    await this._deleteModelUseCase.execute({ modelId: id });
  }

  @Post('/:id/add-section')
  @ApiParam({ name: 'id', type: 'string' })
  async addSection(
    @Param('id') id: string,
    @Body() section: AddSectionDTO
  ): Promise<void> {
    await this._addSectionUseCase.execute({ ...section, modelId: id });
  }

  @Delete('/delete-section/:id')
  @ApiParam({ name: 'id', type: 'string' })
  async deleteSection(@Param('id') id: string): Promise<void> {
    await this._deleteSectionUseCase.execute({ sectionId: id });
  }
}
