import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReadableFile, type FileStorageService } from '@tadil-common';
import { DataReader } from '@tadil-database';
import {
  DisplayAlterationDTO,
  DisplayModelDTO,
  DisplayModelImageDTO,
  InformationType,
  ModelCategory,
  CreateOrderDto,
} from './dtos';
import { fileUploadLocalPath } from '../utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { UploadFileDto } from './dtos/uploadFile.dto';
import { ConfirmReceiptUseCase } from '@tadil-customer';
import { CreateOrderUseCase, ConfirmPaymentUseCase } from '@tadil-orders';
import { AuthGuard } from '../auth/auth.guard';

@Controller('customer')
@ApiTags('Customer')
export class CustomerController {
  constructor(
    private readonly _dataReader: DataReader,
    @Inject('FileStorageService')
    private readonly _fileStorageService: FileStorageService,
    private readonly _confirmReceiptUseCase: ConfirmReceiptUseCase,
    private readonly _createOrderUseCase: CreateOrderUseCase,
    private readonly _confirmPaymentUseCase: ConfirmPaymentUseCase
  ) {}

  @Post('orders')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order from cart' })
  async createOrder(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this._createOrderUseCase.execute({
      customerId: req.user.sub,
      addressId: dto.addressId,
      items: dto.items,
      customItems: dto.customItems,
    });
  }

  @Post('orders/:orderId/payment')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm payment for an order' })
  async confirmPayment(
    @Param('orderId') orderId: string,
    @Body('paymentId') paymentId: string
  ) {
    await this._confirmPaymentUseCase.execute({
      orderId,
      paymentId,
    });
  }

  @Post('orders/:orderId/confirm-receipt')
  @ApiOperation({ summary: 'Confirm receipt of items from return courier' })
  async confirmReceipt(@Param('orderId') orderId: string) {
    await this._confirmReceiptUseCase.execute({ orderId });
  }

  @Get('models')
  @ApiOkResponse({ type: DisplayModelDTO, isArray: true })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: ModelCategory,
  })
  async getModels(
    @Query('category') category?: ModelCategory
  ): Promise<DisplayModelDTO[]> {
    const data = await this._dataReader.queries.model.findMany({
      where:
        {
          OR: category            ? [
                { category: category },
                { category: ModelCategory.ALL },
              ]
            : undefined,
        },
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
          ? `${process.env.Tadil_MOBILE_API}/api/files/${thumbnailImage.fileId}`
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
        imageUrl: `${process.env.Tadil_MOBILE_API}/api/files/${image.fileId}`,
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
        informations: {
          include: { extras: true },
        },
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
        isRequired: info.isRequired,
        type: info.type as InformationType,
        extras: info.extras,
        unit: info.unit ?? undefined,
      })),
    }));
  }

  @Post('files/upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', fileUploadLocalPath))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() _body: UploadFileDto
  ): Promise<string> {
    const imageFile: ReadableFile = {
      path: file.path,
      mimetype: file.mimetype,
      originalName: file.originalname,
      size: file.size,
    };

    const fileExtension = extname(imageFile.path);
    const imageFileId = uuidv4() + fileExtension;

    await this._fileStorageService.uploadFile(imageFileId, imageFile);

    return `${process.env.Tadil_MOBILE_API}/api/files/${imageFileId}`;
  }
}
