import { Controller, Get, Param, Post, Query, NotFoundException, Req, UseGuards, ForbiddenException, ConflictException } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { createWaybillLink, publicBaseUrl, WaybillLinkDTO } from '../common/waybill/waybill.link';
import { buildWaybill } from '../common/waybill/waybill.builder';
import { getOrderEarnings } from '../common/earnings';
import { DataReader } from '@tadil-database';
import { CourierOrderDTO } from './dtos/courierOrder.dto';
import { InformationType } from '../customer/dtos';
import { ShippingLabelDTO } from './dtos/shippingLabel.dto';
import {
  AcceptCourierAssignmentUseCase,
  DeclineCourierAssignmentUseCase,
  ConfirmPickupUseCase,
  MarkAsDeliveredUseCase,
} from '@tadil-courier';
import { signedFileUrl } from '../common/files/file.link';

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
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get available assignments and my active orders' })
  @ApiOkResponse({ type: CourierOrderDTO, isArray: true })
  async getOrders(
    @Req() req: any,
    @Param('id') courierId: string
  ): Promise<CourierOrderDTO[]> {
    // The list carries this driver's earnings, so only they may read it.
    if (req.user?.sub !== courierId) {
      throw new ForbiddenException();
    }
    const openTrips = await this._openTripsFilter(courierId);
    if (!openTrips) {
      return []; // No address, no orders
    }

    // 2. Fetch orders within that city
    const orders = await this._dataReader.queries.order.findMany({
      where: {
        OR: [
          // Available initial assignments in my city
          openTrips.pickup,
          // My initial active orders
          { assignedCourierId: courierId },
          // Available return assignments in my city
          openTrips.return,
          // My return active orders
          { assignedReturnCourierId: courierId }
        ]
      },
      include: {
        address: true,
        customer: { select: { firstName: true, lastName: true } },
        // The tailor is one end of every trip: the drop-off on the way in and
        // the pickup on the way back. Their first address is the workshop,
        // the same one the shipping label prints.
        assignedTailor: {
          select: {
            firstName: true,
            lastName: true,
            addresses: { take: 1 },
          },
        },
        items: { include: { sections: { include: { alterations: { include: { informations: true } } } } } },
        customItems: { include: { alterations: { include: { informations: true } } } },
        history: { orderBy: { timestamp: 'desc' } },
      },
    });

    // A driver is paid per leg: doing both the pickup and the return on the
    // same order earns their share twice, as the crediting does.
    const earnings = await getOrderEarnings(
      this._dataReader,
      courierId,
      orders,
      (order) =>
        order.assignedCourierId === courierId &&
        order.assignedReturnCourierId === courierId
          ? 2
          : 1,
    );
    return orders.map((order) => ({
      ...this._mapOrder(order),
      ...earnings.get(order.id)!,
    }));
    }

    @Get('/orders/:orderId/waybill')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a short-lived link to view and print the order waybill' })
    @ApiOkResponse({ type: WaybillLinkDTO })
    async getWaybill(
      @Req() req: any,
      @Param('id') courierId: string,
      @Param('orderId') orderId: string
    ): Promise<WaybillLinkDTO> {
      if (req.user?.sub !== courierId) {
        throw new ForbiddenException();
      }
      // Fails with 403/404 unless this courier is on the order.
      await buildWaybill(this._dataReader, orderId, 'courier', req.user.sub);
      return createWaybillLink(orderId, 'courier', req.user.sub, publicBaseUrl(req));
    }

    @Get('/orders/:orderId/shipping-label')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get shipping label details for a specific order' })
    @ApiOkResponse({ type: ShippingLabelDTO })
    async getShippingLabel(
    @Req() req: any,
    @Param('id') courierId: string,
    @Param('orderId') orderId: string
    ): Promise<ShippingLabelDTO> {
    this._assertCourier(req, courierId);

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
    // It carries the customer's phone and address: only for the order's drivers.
    if (
      prismaOrder.assignedCourierId !== courierId &&
      prismaOrder.assignedReturnCourierId !== courierId
    ) {
      throw new ForbiddenException();
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept a courier assignment' })
  async accept(
    @Req() req: any,
    @Param('id') courierId: string,
    @Param('orderId') orderId: string,
    @Query('isReturn') isReturn: string
  ) {
    this._assertCourier(req, courierId);
    const returnTrip = isReturn === 'true';

    // Only a trip this driver is offered: open, in their area, not declined.
    const openTrips = await this._openTripsFilter(courierId);
    const offered =
      openTrips &&
      (await this._dataReader.queries.order.findFirst({
        where: {
          AND: [{ id: orderId }, returnTrip ? openTrips.return : openTrips.pickup],
        },
        select: { id: true },
      }));
    if (!offered) {
      throw new ConflictException('This trip is no longer available');
    }

    // The write re-checks the status, so a second driver can't take it too.
    const accepted = await this._acceptUseCase.execute({
      courierId,
      orderId,
      isReturn: returnTrip,
    });
    if (!accepted) {
      throw new ConflictException('This trip is no longer available');
    }
  }

  @Post('/orders/:orderId/decline')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Decline a courier assignment' })
  async decline(
    @Req() req: any,
    @Param('id') courierId: string,
    @Param('orderId') orderId: string,
    @Query('isReturn') isReturn: string
  ) {
    this._assertCourier(req, courierId);
    await this._declineUseCase.execute({
      courierId,
      orderId,
      isReturn: isReturn === 'true'
    });
  }

  @Post('/orders/:orderId/pickup')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm pickup of items' })
  async pickup(
    @Req() req: any,
    @Param('id') courierId: string,
    @Param('orderId') orderId: string
  ) {
    this._assertCourier(req, courierId);
    const pickedUp = await this._pickupUseCase.execute({ courierId, orderId });
    if (!pickedUp) {
      throw new ForbiddenException(
        'Order is not waiting for pickup by this driver'
      );
    }
  }

  @Post('/orders/:orderId/deliver')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark order as delivered (arrived at destination)' })
  async deliver(
    @Req() req: any,
    @Param('id') courierId: string,
    @Param('orderId') orderId: string
  ) {
    this._assertCourier(req, courierId);
    const delivered = await this._deliverUseCase.execute({ courierId, orderId });
    if (!delivered) {
      throw new ForbiddenException('Order is not on its way with this driver');
    }
  }

  /**
   * Trips waiting for a driver in this driver's area that they haven't
   * declined, or null when the driver has no address yet.
   */
  private async _openTripsFilter(courierId: string) {
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
      return null; // No address, no open trips
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

    return {
      pickup: {
        AND: [
          { status: 'waitingForCourierAssignement' as const },
          { address: courierAreaFilter },
          { NOT: { rejectedCouriers: { some: { id: courierId } } } },
        ],
      },
      return: {
        AND: [
          { status: 'waitingForReturnCourierAssignement' as const },
          { address: courierAreaFilter },
          { NOT: { rejectedReturnCouriers: { some: { id: courierId } } } },
        ],
      },
    };
  }

  /** Only the driver named in the URL may act on their trips. */
  private _assertCourier(req: any, courierId: string) {
    if (req.user?.role !== 'courier' || req.user?.sub !== courierId) {
      throw new ForbiddenException();
    }
  }

  private _mapOrder(order: any): CourierOrderDTO {
    const { assignedTailor, ...rest } = order;
    return {
      ...rest,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      tailorName: assignedTailor
        ? `${assignedTailor.firstName} ${assignedTailor.lastName}`
        : null,
      tailorAddress: assignedTailor?.addresses?.[0] ?? null,
      items: order.items.map((item: any) => ({
        ...item,
        imageFileUrl: signedFileUrl(item.imageFileId),
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
        imageFileUrl: signedFileUrl(item.imageFileId),
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
