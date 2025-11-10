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
  CreateServiceUseCase,
  UpdateServiceUseCase,
  DeleteServiceUseCase,
} from '@tadil-services';
import { CreateServiceDTO, DisplayServiceDTO, UpdateServiceDTO } from './dtos';

@Controller('services')
@ApiTags('Services')
export class ServicesController {
  constructor(
    private readonly _createServiceUseCase: CreateServiceUseCase,
    private readonly _updateServiceUseCase: UpdateServiceUseCase,
    private readonly _deleteServiceUseCase: DeleteServiceUseCase,
    private readonly _dataReader: DataReader
  ) {}

  @Get('/')
  @ApiOkResponse({ type: DisplayServiceDTO, isArray: true })
  async getServices(): Promise<DisplayServiceDTO[]> {
    const services = await this._dataReader.queries.service.findMany({
      include: {
        sections: { select: { id: true } },
        alterations: { select: { id: true } },
      },
    });
    return services.map((service) => ({
      ...service,
      sections: service.sections.map((section) => section.id),
      alterations: service.alterations.map((alteration) => alteration.id),
    }));
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({ type: DisplayServiceDTO })
  async getServiceById(@Param('id') id: string): Promise<DisplayServiceDTO> {
    const service = await this._dataReader.queries.service.findUnique({
      where: { id },
      include: {
        sections: { select: { id: true } },
        alterations: { select: { id: true } },
      },
    });

    if (!service)
      throw new NotFoundException(`Service with id ${id} not found`);
    return {
      ...service,
      sections: service.sections.map((section) => section.id),
      alterations: service.alterations.map((alteration) => alteration.id),
    };
  }

  @Post('/create')
  async createService(@Body() service: CreateServiceDTO): Promise<void> {
    await this._createServiceUseCase.execute(service);
  }

  @Put('/update/:id')
  @ApiParam({ name: 'id', type: 'string' })
  async updateService(
    @Param('id') id: string,
    @Body() service: UpdateServiceDTO
  ): Promise<void> {
    await this._updateServiceUseCase.execute({ ...service, id });
  }

  @Delete('/delete/:id')
  @ApiParam({ name: 'id', type: 'string' })
  async deleteService(@Param('id') id: string): Promise<void> {
    await this._deleteServiceUseCase.execute({ serviceId: id });
  }
}
