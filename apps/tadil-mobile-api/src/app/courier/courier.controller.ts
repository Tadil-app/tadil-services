import { Controller, Get, Param, Post, Query, NotFoundException } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { DataReader } from '@tadil-database';
import { DisplayOrderDTO } from '../tailor/dtos/order';
import { InformationType } from '../customer/dtos';
import { ShippingLabelDTO } from './dtos/shippingLabel.dto';
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
    // 1. Fetch courier's city and district
    const courierAddress = await this._dataReader.queries.address.findFirst({
      where: { userId: courierId },
      select: {
        cityId: true,
        cityNameEn: true,
        districtId: true,
        districtNameEn: true,
      },
    });

    if (!courierAddress) {
      return []; // No address, no orders
    }

    // Match orders in the same city by id when available, else by name.
    const courierCityFilter =
      courierAddress.cityId != null
        ? { cityId: courierAddress.cityId }
        : { cityNameEn: courierAddress.cityNameEn };

    // District narrows the city only when BOTH sides have one: a courier with
    // just a city serves the whole city, and an order with just a city is open
    // to any same-city courier. When the courier and the order both have a
    // district, they must match (by id, falling back to name).
    const courierAreaFilter =
      courierAddress.districtId != null || courierAddress.districtNameEn != null
        ? {
            AND: [
              courierCityFilter,
              {
                OR: [
                  { districtId: null, districtNameEn: null },
                  courierAddress.districtId != null
                    ? { districtId: courierAddress.districtId }
                    : { districtNameEn: courierAddress.districtNameEn },
                ],
              },
            ],
          }
        : courierCityFilter;

    // 2. Fetch orders within that city
    const orders = await this._dataReader.queries.order.findMany({
      where: {
        OR: [
          // Available initial assignments in my city
          {
            AND: [
              { status: 'waitingForCourierAssignement' },
              { address: courierAreaFilter },
              { NOT: { rejectedCouriers: { some: { id: courierId } } } }
            ]
          },
          // My initial active orders
          { assignedCourierId: courierId },
          // Available return assignments in my city
          {
            AND: [
              { status: 'waitingForReturnCourierAssignement' },
              { address: courierAreaFilter },
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

    @Get('/orders/:orderId/shipping-label')
    @ApiOperation({ summary: 'Get shipping label details for a specific order' })
    @ApiOkResponse({ type: ShippingLabelDTO })
    async getShippingLabel(
    @Param('id') courierId: string,
    @Param('orderId') orderId: string
    ): Promise<ShippingLabelDTO> {
    const prismaOrder = await this._dataReader.queries.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        address: true,
        assignedTailor: {
          include: {
            addresses: true,
          },
        },
        items: {
          include: {
            sections: {
              include: {
                alterations: true,
              },
            },
          },
        },
        customItems: {
          include: {
            alterations: true,
          },
        },
      },
    });

    if (!prismaOrder) {
      throw new NotFoundException('Order not found');
    }

    const order: any = prismaOrder;

    const customerAddressStr = order.address
      ? `${order.address.cityNameEn}, ${order.address.districtNameEn || ''}, ${order.address.street}`
      : 'N/A';

    // The tailor's address is stored in the addresses array
    const tailorAddressObj = order.assignedTailor?.addresses?.[0];
    const tailorAddressStr = tailorAddressObj
      ? `${tailorAddressObj.cityNameEn}, ${tailorAddressObj.districtNameEn || ''}, ${tailorAddressObj.street}`
      : 'N/A';

    const items: any[] = [];

    order.items.forEach((item: any) => {
     const details = item.sections
       .map((s: any) => {
         const alts = s.alterations.map((a: any) => a.englishName).join(', ');
         return `${s.englishName} (${alts})`;
       })
       .join('; ');

     items.push({
       name: item.englishName,
       details,
       price: item.price,
     });
    });

    order.customItems.forEach((item: any) => {
     const details = item.alterations.map((a: any) => a.englishName).join(', ');
     items.push({
       name: 'Custom Model',
       details,
       price: item.price,
     });
    });

    return {
     orderId: order.id,
     orderReference: order.reference,
     orderDate: order.date,
     totalPrice: order.totalPrice,
     customerName: `${order.customer.firstName} ${order.customer.lastName}`,
     customerPhone: order.customer.phone,
     customerAddress: customerAddressStr,
     tailorName: order.assignedTailor
       ? `${order.assignedTailor.firstName} ${order.assignedTailor.lastName}`
       : 'N/A',
     tailorPhone: order.assignedTailor?.phone || 'N/A',
     tailorAddress: tailorAddressStr,
     items,
    };
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
