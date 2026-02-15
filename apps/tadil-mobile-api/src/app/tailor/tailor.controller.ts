import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DataReader } from '@tadil-database';
import { DisplayOrderDTO } from './dtos/order';
import { InformationType } from '@tadil-informations';
import { AcceptOrderUseCase, DeclineOrderUseCase } from '@tadil-tailor';

@Controller('tailor/:id')
@ApiTags('Tailor')
export class TailorController {
  constructor(
    private readonly _dataReader: DataReader,
    private readonly _acceptOrderUseCase: AcceptOrderUseCase,
    private readonly _declineOrderUseCase: DeclineOrderUseCase
  ) {}

  @Get('/orders')
  @ApiOkResponse({ type: DisplayOrderDTO, isArray: true })
  async getOrders(@Param('id') tailorId: string): Promise<DisplayOrderDTO[]> {
    const orders = await this._dataReader.queries.order.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                status: 'pending',
              },
              {
                NOT: {
                  rejectedTailors: {
                    some: {
                      id: tailorId,
                    },
                  },
                },
              },
            ],
          },
          {
            assignedTailorId: tailorId,
          },
        ],
      },
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

  @Post('/orders/:orderId/accept')
  async acceptOrder(
    @Param('id') tailorId: string,
    @Param('orderId') orderId: string
  ) {
    await this._acceptOrderUseCase.execute({
      tailorId,
      orderId,
    });
  }

  @Post('/orders/:orderId/decline')
  async declineOrder(
    @Param('id') tailorId: string,
    @Param('orderId') orderId: string
  ) {
    await this._declineOrderUseCase.execute({
      tailorId,
      orderId,
    });
  }
}
