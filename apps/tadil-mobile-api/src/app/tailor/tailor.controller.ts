import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DataReader } from '@tadil-database';
import { DisplayOrderDTO } from './dtos/order';
import { InformationType } from '@tadil-informations';

@Controller('tailor')
@ApiTags('Tailor')
export class TailorController {
  constructor(private readonly _dataReader: DataReader) {}

  @Get('/orders')
  @ApiOkResponse({ type: DisplayOrderDTO, isArray: true })
  async getOrders(): Promise<DisplayOrderDTO[]> {
    const orders = await this._dataReader.queries.order.findMany({
      include: {
        items: {
          include: {
            sections: {
              include: {
                alterations: {
                  include: {
                    informations: true,
                  },
                },
              },
            },
          },
        },
        customItems: {
          include: {
            alterations: {
              include: {
                informations: true,
              },
            },
          },
        },
      },
    });

    return orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        imageFileUrl: `${process.env.Tadil_MOBILE_API}/api/files/${item.imageFileId}`,
        sections: item.sections.map((section) => ({
          ...section,
          alterations: section.alterations.map((alteration) => ({
            ...alteration,
            informations: alteration.informations.map((information) => ({
              ...information,
              type: information.type as InformationType,
              unit: information.unit ?? undefined,
            })),
          })),
        })),
      })),
      customItems: order.customItems.map((customItem) => ({
        ...customItem,
        imageFileUrl: `${process.env.Tadil_MOBILE_API}/api/files/${customItem.imageFileId}`,
        alterations: customItem.alterations.map((alteration) => ({
          ...alteration,
          informations: alteration.informations.map((information) => ({
            ...information,
            type: information.type as InformationType,
            unit: information.unit ?? undefined,
          })),
        })),
      })),
    }));
  }
}
