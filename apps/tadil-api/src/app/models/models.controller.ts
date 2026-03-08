import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  AddModelImageUseCase,
  AddSectionUseCase,
  CreateModelUseCase,
  UpdateModelUseCase,
  UpdateSectionUseCase,
  DeleteModelImageUseCase,
  DeleteModelUseCase,
  DeleteSectionUseCase,
} from '@tadil-models';
import {
  AddModelImageDTO,
  AddSectionDTO,
  UpdateSectionDTO,
  CreateModelDTO,
  DisplayModelDTO,
  DisplayModelImageDTO,
  DisplaySectionDTO,
  UpdateModelDTO,
} from './dtos';
import { FilesInterceptor } from '@nestjs/platform-express';
import { type FileStorageService, ReadableFile } from '@tadil-common';
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
    private readonly _updateModelUseCase: UpdateModelUseCase,
    private readonly _deleteModelUseCase: DeleteModelUseCase,
    private readonly _addModelImageUseCase: AddModelImageUseCase,
    private readonly _deleteModelImageUseCase: DeleteModelImageUseCase,
    private readonly _addSectionUseCase: AddSectionUseCase,
    private readonly _updateSectionUseCase: UpdateSectionUseCase,
    private readonly _deleteSectionUseCase: DeleteSectionUseCase,
    @Inject('FileStorageService')
    private readonly _fileStorageService: FileStorageService
  ) {}

  @Get('/')
  @ApiOkResponse({ type: DisplayModelDTO, isArray: true })
  async getModels(): Promise<DisplayModelDTO[]> {
    const models = await this._dataReader.queries.model.findMany({
      include: { images: { select: { fileId: true } } },
    });
    const modelsWithThumbNails = await Promise.all(
      models.map(async (model) => {
        let thumbNailImageBase64String: string | undefined;
        if (model.images.length > 0) {
          const thumbNailImage = model.images[0];
          const thumbNailImageStream =
            await this._fileStorageService.downloadFile(thumbNailImage.fileId);
          thumbNailImageBase64String = await streamToBase64(
            thumbNailImageStream
          );
        }
        return {
          id: model.id,
          englishName: model.englishName,
          arabicName: model.arabicName,
          hindiName: model.hindiName,
          urduName: model.urduName,
          bengaliName: model.bengaliName,
          category: model.category ?? undefined,
          thumbNailImageBase64String,
        };
      })
    );
    return modelsWithThumbNails;
  }

  @Post('/create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', undefined, fileUploadLocalPath))
  async createModel(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() model: CreateModelDTO
  ): Promise<void> {
    try {
      const newModelId = await this._createModelUseCase.execute(model);
      await Promise.all(
        files.map(async (file) => {
          const imageFile: ReadableFile = {
            path: file.path,
            mimetype: file.mimetype,
            originalName: file.originalname,
            size: file.size,
          };
          await this._addModelImageUseCase.execute({
            modelId: newModelId,
            imageFile,
          });
        })
      );
    } finally {
      files.forEach((file) => {
        cleanupLocalFile(file.path);
      });
    }
  }

  @Post('/images/:id/sections/add')
  @ApiParam({ name: 'id', type: 'string' })
  async addSection(
    @Param('id') id: string,
    @Body() section: AddSectionDTO
  ): Promise<void> {
    await this._addSectionUseCase.execute({
      ...section,
      modelImageId: id,
    });
  }

  @Patch('/images/sections/:id/update')
  @ApiParam({ name: 'id', type: 'string' })
  async updateSection(
    @Param('id') id: string,
    @Body() section: UpdateSectionDTO
  ): Promise<void> {
    await this._updateSectionUseCase.execute({
      ...section,
      id,
    });
  }

  @Delete('/images/:id/delete')
  @ApiParam({ name: 'id', type: 'string' })
  async deleteModelImage(@Param('id') id: string): Promise<void> {
    await this._deleteModelImageUseCase.execute({ imageId: id });
  }

  @Get('/images/sections')
  @ApiOkResponse({ type: DisplaySectionDTO, isArray: true })
  async getSections(): Promise<DisplaySectionDTO[]> {
    const sections = await this._dataReader.queries.section.findMany({
      include: { services: { select: { id: true } } },
    });
    return sections.map((section) => ({
      ...section,
      coordinates: section.coordinates as unknown as { x: number; y: number }[],
      alterations: section.services.map((service) => service.id),
    }));
  }

  @Delete('/images/sections/:id/delete')
  @ApiParam({ name: 'id', type: 'string' })
  async deleteSection(@Param('id') id: string): Promise<void> {
    await this._deleteSectionUseCase.execute({ sectionId: id });
  }

  @Get('/:id/images')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({ type: DisplayModelImageDTO, isArray: true })
  async getModelImages(
    @Param('id') id: string
  ): Promise<DisplayModelImageDTO[]> {
    const modelImages = await this._dataReader.queries.modelImage.findMany({
      where: { modelId: id },
      include: {
        sections: {
          include: {
            services: { select: { id: true } },
          },
        },
      },
    });

    const images = await Promise.all(
      modelImages.map(async (image) => {
        const imageStream = await this._fileStorageService.downloadFile(
          image.fileId
        );
        const imageBase64String = await streamToBase64(imageStream);
        return {
          id: image.id,
          fileId: image.fileId,
          imageBase64String,
          sections: image.sections.map((section) => ({
            id: section.id,
            englishName: section.englishName,
            arabicName: section.arabicName,
            hindiName: section.hindiName,
            urduName: section.urduName,
            bengaliName: section.bengaliName,
            coordinates: section.coordinates as unknown as {
              x: number;
              y: number;
            }[],
            alterations: section.services.map((service) => service.id),
          })),
        };
      })
    );
    return images;
  }

  @Post('/:id/images/add')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AddModelImageDTO })
  @UseInterceptors(FilesInterceptor('files', undefined, fileUploadLocalPath))
  async addModelImage(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<void> {
    try {
      await Promise.all(
        files.map(async (file) => {
          const imageFile: ReadableFile = {
            path: file.path,
            mimetype: file.mimetype,
            originalName: file.originalname,
            size: file.size,
          };
          await this._addModelImageUseCase.execute({
            modelId: id,
            imageFile,
          });
        })
      );
    } finally {
      files.forEach((file) => {
        cleanupLocalFile(file.path);
      });
    }
  }

  @Patch('/:id/update')
  @ApiParam({ name: 'id', type: 'string' })
  async updateModel(
    @Param('id') id: string,
    @Body() model: UpdateModelDTO
  ): Promise<void> {
    await this._updateModelUseCase.execute({ ...model, id });
  }

  @Delete('/:id/delete')
  @ApiParam({ name: 'id', type: 'string' })
  async deleteModel(@Param('id') id: string): Promise<void> {
    await this._deleteModelUseCase.execute({ modelId: id });
  }
}
