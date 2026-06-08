import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { DataReader } from '@tadil-database';
import { DisplayOrderDTO } from '../tailor/dtos/order';
import { InformationType } from '../customer/dtos';
import {
  AcceptCourierAssignmentUseCase,
  DeclineCourierAssignmentUseCase,
  ConfirmPickupUseCase,
  MarkAsDeliveredUseCase,
} from '@tadil-courier';

@Controller('courier/:id')
@ApiTags('Courier')
export class CourierController {
  constructor(
    private readonly _dataReader: DataReader,
    private readonly _acceptUseCase: AcceptCourierAssignmentUseCase,
    private readonly _declineUseCase: DeclineCourierAssignmentUseCase,
    private readonly _pickupUseCase: ConfirmPickupUseCase,
    private readonly _deliverUseCase: MarkAsDeliveredUseCase
  ) {}

  @Get('/orders')
  @ApiOperation({ summary: 'Get available assignments and my active orders' })
  @ApiOkResponse({ type: DisplayOrderDTO, isArray: true })
  async getOrders(@Param('id') courierId: string): Promise<DisplayOrderDTO[]> {
    // 1. Fetch courier's city
    const courierAddress = await this._dataReader.queries.address.findFirst({
      where: { userId: courierId },
      select: { cityId: true, cityNameEn: true },
    });

    if (!courierAddress) {
      return []; // No address, no orders
    }

    // Match orders in the same city by id when available, else by name.
    const courierCityFilter =
      courierAddress.cityId != null
        ? { cityId: courierAddress.cityId }
        : { cityNameEn: courierAddress.cityNameEn };

    // 2. Fetch orders within that city
    const orders = await this._dataReader.queries.order.findMany({
      where: {
        OR: [
          // Available initial assignments in my city
          {
            AND: [
              { status: 'waitingForCourierAssignement' },
              { address: courierCityFilter },
              { NOT: { rejectedCouriers: { some: { id: courierId } } } }
            ]
          },
          // My initial active orders
          { assignedCourierId: courierId },
          // Available return assignments in my city
          {
            AND: [
              { status: 'waitingForReturnCourierAssignement' },
              { address: courierCityFilter },
              { NOT: { rejectedReturnCouriers: { some: { id: courierId } } } }
            ]
          },
          // My return active orders
          { assignedReturnCourierId: courierId }
        ]
      },
      include: {
        address: true,
        items: { include: { sections: { include: { alterations: { include: { informations: true } } } } } },
        customItems: { include: { alterations: { include: { informations: true } } } },
        history: { orderBy: { timestamp: 'desc' } },
      },
    });

    return orders.map((order) => this._mapOrder(order));
  }

  @Post('/orders/:orderId/accept')
  @ApiOperation({ summary: 'Accept a courier assignment' })
  async accept(
    @Param('id') courierId: string,
    @Param('orderId') orderId: string,
    @Query('isReturn') isReturn: string
  ) {
    await this._acceptUseCase.execute({
      courierId,
      orderId,
      isReturn: isReturn === 'true'
    });
  }

  @Post('/orders/:orderId/decline')
  @ApiOperation({ summary: 'Decline a courier assignment' })
  async decline(
    @Param('id') courierId: string,
    @Param('orderId') orderId: string,
    @Query('isReturn') isReturn: string
  ) {
    await this._declineUseCase.execute({
      courierId,
      orderId,
      isReturn: isReturn === 'true'
    });
  }

  @Post('/orders/:orderId/pickup')
  @ApiOperation({ summary: 'Confirm pickup of items' })
  async pickup(@Param('orderId') orderId: string) {
    await this._pickupUseCase.execute({ orderId });
  }

  @Post('/orders/:orderId/deliver')
  @ApiOperation({ summary: 'Mark order as delivered (arrived at destination)' })
  async deliver(@Param('orderId') orderId: string) {
    await this._deliverUseCase.execute({ orderId });
  }

  private _mapOrder(order: any): DisplayOrderDTO {
    return {
      ...order,
      items: order.items.map((item: any) => ({
        ...item,
        imageFileUrl: `${process.env.TADIL_MOBILE_API}/api/files/${item.imageFileId}`,
        sections: item.sections.map((section: any) => ({
          ...section,
          alterations: section.alterations.map((alt: any) => ({
            ...alt,
            informations: alt.informations.map((info: any) => ({
              ...info,
              type: info.type as InformationType,
              unit: info.unit ?? undefined,
              extraDetails: info.extraDetails,
            })),
          })),
        })),
      })),
      customItems: order.customItems.map((item: any) => ({
        ...item,
        imageFileUrl: `${process.env.TADIL_MOBILE_API}/api/files/${item.imageFileId}`,
        alterations: item.alterations.map((alt: any) => ({
          ...alt,
          informations: alt.informations.map((info: any) => ({
            ...info,
            type: info.type as InformationType,
            unit: info.unit ?? undefined,
            extraDetails: info.extraDetails,
          })),
        })),
      })),
      history: order.history || [],
    };
  }
}
