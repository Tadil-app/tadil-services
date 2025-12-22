import { Controller, Get, Inject, Param, Query, Res } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { type FileStorageService } from '@tadil-common';
import { DataReader } from '@tadil-database';
import { type Response } from 'express';
import {
  DisplayAlterationDTO,
  DisplayModelDTO,
  DisplayModelImageDTO,
} from './dtos';
import { ModelCategory } from '@tadil-models';

@Controller('customer')
@ApiTags('Customer')
export class CustomerController {
  constructor(
    private readonly _dataReader: DataReader,
    @Inject('FileStorageService')
    private readonly _fileStorageService: FileStorageService
  ) {}

  @Get('models')
  @ApiOkResponse({ type: DisplayModelDTO, isArray: true })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: ModelCategory,
    description: 'Filter models by category',
  })
  async getModels(
    @Query('category') category?: ModelCategory
  ): Promise<DisplayModelDTO[]> {
    const data = await this._dataReader.queries.model.findMany({
      where:
        category && category !== ModelCategory.ALL ? { category } : undefined,
      include: { images: { select: { fileId: true } } },
    });
    const models = data.map((model) => {
      const thumbnailImage =
        model.images.length > 0 ? model.images[0] : undefined;
      return {
        id: model.id,
        englishName: model.englishName,
        arabicName: model.arabicName,
        hindiName: model.hindiName,
        urduName: model.urduName,
        bengaliName: model.bengaliName,
        category: model.category as ModelCategory,
        thumbnailImageUrl: thumbnailImage
          ? `/api/customer/files/${thumbnailImage.fileId}`
          : undefined,
      };
    });
    return models;
  }

  @Get('models/:id/images')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({ type: DisplayModelImageDTO, isArray: true })
  async getModelImages(
    @Param('id') id: string
  ): Promise<DisplayModelImageDTO[]> {
    const modelImages = await this._dataReader.queries.modelImage.findMany({
      where: { modelId: id },
      include: { sections: true },
    });

    const images = modelImages.map((image) => {
      return {
        id: image.id,
        imageUrl: `${process.env.Tadil_MOBILE_API}/api/customer/files/${image.fileId}`,
        sections: image.sections.map((section) => ({
          id: section.id,
          englishName: section.englishName,
          arabicName: section.arabicName,
          hindiName: section.hindiName,
          urduName: section.urduName,
          bengaliName: section.bengaliName,
          coordinates: section.coordinates,
        })),
      };
    });

    return images;
  }

  @Get('alterations')
  @ApiOkResponse({ type: DisplayAlterationDTO, isArray: true })
  @ApiQuery({
    name: 'sectionId',
    type: 'string',
    required: false,
    description: 'Filter alterations by section ID',
  })
  async getAlterations(
    @Query('sectionId') sectionId?: string
  ): Promise<DisplayAlterationDTO[]> {
    const alterations = await this._dataReader.queries.alteration.findMany({
      where: sectionId
        ? {
            sections: {
              some: {
                id: sectionId,
              },
            },
          }
        : undefined,
      include: {
        informations: true,
      },
    });

    return alterations.map((alteration) => ({
      id: alteration.id,
      englishName: alteration.englishName,
      arabicName: alteration.arabicName,
      hindiName: alteration.hindiName,
      urduName: alteration.urduName,
      bengaliName: alteration.bengaliName,
      price: alteration.price,
      informations: alteration.informations.map((info) => ({
        id: info.id,
        englishName: info.englishName,
        arabicName: info.arabicName,
        hindiName: info.hindiName,
        urduName: info.urduName,
        bengaliName: info.bengaliName,
        unit: info.unit ?? undefined,
      })),
    }));
  }

  @Get('files/:id')
  async getFileStream(@Param('id') fileId: string, @Res() res: Response) {
    try {
      const fileStream = await this._fileStorageService.downloadFile(fileId);
      res.setHeader('Content-Disposition', `inline; filename="${fileId}"`);
      fileStream.on('error', (error) => {
        if (!res.headersSent) {
          res.status(500).send('Error in file retrieval: ' + error.message);
        }
      });
      fileStream.on('end', () => {
        res.end();
      });
      fileStream.pipe(res);
    } catch (error: unknown) {
      if (!res.headersSent) {
        if (error instanceof Error)
          res.status(500).send('Error while retrieving file: ' + error.message);
        else res.status(500).send('Error while retrieving file: ' + error);
      }
    }
  }
}
