import {
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { DataReader } from '@tadil-database';
import { DisplayOrderDTO } from './dtos/order';
import { InformationType } from '../customer/dtos';
import { 
  AcceptOrderUseCase, 
  DeclineOrderUseCase, 
  ConfirmReceiptUseCase, 
  MarkOrderReadyUseCase 
} from '@tadil-tailor';
import { AuthGuard } from '../auth/auth.guard';
import { createWaybillLink, publicBaseUrl, WaybillLinkDTO } from '../common/waybill/waybill.link';
import { buildWaybill } from '../common/waybill/waybill.builder';
import { getOrderEarnings } from '../common/earnings';
import { OrderNotifier } from '@tadil-notifications';
import { signedFileUrl } from '../common/files/file.link';

@Controller('tailor/:id')
@ApiTags('Tailor')
export class TailorController {
  constructor(
    private readonly _dataReader: DataReader,
    private readonly _acceptOrderUseCase: AcceptOrderUseCase,
    private readonly _declineOrderUseCase: DeclineOrderUseCase,
    private readonly _confirmReceiptUseCase: ConfirmReceiptUseCase,
    private readonly _markReadyUseCase: MarkOrderReadyUseCase,
    private readonly _orderNotifier: OrderNotifier
  ) {}

  @Get('/orders')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: DisplayOrderDTO, isArray: true })
  async getOrders(
    @Req() req: any,
    @Param('id') tailorId: string
  ): Promise<DisplayOrderDTO[]> {
    // The list carries this tailor's earnings, so only they may read it.
    if (req.user?.sub !== tailorId) {
      throw new ForbiddenException();
    }
    const openOrders = await this._openOrdersFilter(tailorId);
    if (!openOrders) {
      return []; // No address, no orders
    }

    // 2. Open orders in their area, and their own orders
    const orders = await this._dataReader.queries.order.findMany({
      where: {
        OR: [
          openOrders,
          { assignedTailorId: tailorId },
        ],
      },
      include: {
        address: true,
        customer: { select: { firstName: true, lastName: true } },
        items: { include: { sections: { include: { alterations: { include: { informations: true } } } } } },
        customItems: { include: { alterations: { include: { informations: true } } } },
        history: { orderBy: { timestamp: 'desc' } },
      },
    });

    const earnings = await getOrderEarnings(this._dataReader, tailorId, orders);
    return orders.map((order) => ({
      ...this._mapOrder(order),
      ...earnings.get(order.id)!,
    }));
  }

  @Post('/orders/:orderId/accept')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept a tailor assignment' })
  async acceptOrder(
    @Req() req: any,
    @Param('id') tailorId: string,
    @Param('orderId') orderId: string
  ) {
    this._assertTailor(req, tailorId);

    // Only an order this tailor is offered: open, in their area, not declined.
    const openOrders = await this._openOrdersFilter(tailorId);
    const offered =
      openOrders &&
      (await this._dataReader.queries.order.findFirst({
        where: { AND: [{ id: orderId }, openOrders] },
        select: { id: true },
      }));
    if (!offered) {
      throw new ConflictException('This order is no longer available');
    }

    // The write re-checks the status, so a second tailor can't take it too.
    const accepted = await this._acceptOrderUseCase.execute({
      tailorId,
      orderId,
    });
    if (!accepted) {
      throw new ConflictException('This order is no longer available');
    }
    // Drivers of the area can now pick it up from the customer.
    this._orderNotifier.orderStatusChanged(orderId, tailorId);
  }

  @Post('/orders/:orderId/decline')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Decline a tailor assignment' })
  async declineOrder(
    @Req() req: any,
    @Param('id') tailorId: string,
    @Param('orderId') orderId: string
  ) {
    this._assertTailor(req, tailorId);
    await this._declineOrderUseCase.execute({
      tailorId,
      orderId,
    });
  }

  @Get('/orders/:orderId/waybill')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a short-lived link to view and print the order waybill' })
  @ApiOkResponse({ type: WaybillLinkDTO })
  async getWaybill(
    @Req() req: any,
    @Param('id') tailorId: string,
    @Param('orderId') orderId: string
  ): Promise<WaybillLinkDTO> {
    if (req.user?.sub !== tailorId) {
      throw new ForbiddenException();
    }
    // Fails with 403/404 unless this tailor is on the order.
      await buildWaybill(this._dataReader, orderId, 'tailor', req.user.sub);
      return createWaybillLink(orderId, 'tailor', req.user.sub, publicBaseUrl(req));
  }

  @Post('/orders/:orderId/confirm-receipt')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm receipt of items from courier' })
  async confirmReceipt(
    @Req() req: any,
    @Param('id') tailorId: string,
    @Param('orderId') orderId: string
  ) {
    this._assertTailor(req, tailorId);

    const confirmed = await this._confirmReceiptUseCase.execute({
      tailorId: req.user.sub,
      orderId,
    });
    if (!confirmed) {
      throw new ForbiddenException(
        'Order is not assigned to this tailor or cannot be received'
      );
    }
  }

  @Post('/orders/:orderId/mark-ready')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark work as ready for return courier' })
  async markReady(
    @Req() req: any,
    @Param('id') tailorId: string,
    @Param('orderId') orderId: string
  ) {
    this._assertTailor(req, tailorId);

    const ready = await this._markReadyUseCase.execute({ tailorId, orderId });
    if (!ready) {
      throw new ForbiddenException(
        'Order is not in progress with this tailor'
      );
    }
    // Drivers of the area can now bring it back to the customer.
    this._orderNotifier.orderStatusChanged(orderId);
  }

  /**
   * Orders waiting for a tailor in this tailor's area that they haven't
   * declined, or null when the tailor has no address yet.
   */
  private async _openOrdersFilter(tailorId: string) {
    // 1. Fetch tailor's city and district
    const tailorAddress = await this._dataReader.queries.address.findFirst({
      where: { userId: tailorId },
      select: {
        cityId: true,
        cityNameEn: true,
        districtId: true,
        districtNameEn: true,
      },
    });

    if (!tailorAddress) {
      return null; // No address, no open orders
    }

    // Match orders in the same city by id when available, else by name.
    const tailorCityFilter =
      tailorAddress.cityId != null
        ? { cityId: tailorAddress.cityId }
        : { cityNameEn: tailorAddress.cityNameEn };

    // District narrows the city only when BOTH sides have one: a tailor with
    // just a city serves the whole city, and an order with just a city is open
    // to any same-city tailor. When the tailor and the order both have a
    // district, they must match (by id, falling back to name).
    const tailorAreaFilter =
      tailorAddress.districtId != null || tailorAddress.districtNameEn != null
        ? {
            AND: [
              tailorCityFilter,
              {
                OR: [
                  { districtId: null, districtNameEn: null },
                  tailorAddress.districtId != null
                    ? { districtId: tailorAddress.districtId }
                    : { districtNameEn: tailorAddress.districtNameEn },
                ],
              },
            ],
          }
        : tailorCityFilter;

    return {
      AND: [
        { status: 'waitingForTailorAssignement' as const },
        { address: tailorAreaFilter },
        { NOT: { rejectedTailors: { some: { id: tailorId } } } },
      ],
    };
  }

  /** Only the tailor named in the URL may act on their orders. */
  private _assertTailor(req: any, tailorId: string) {
    if (req.user?.role !== 'tailor' || req.user?.sub !== tailorId) {
      throw new ForbiddenException();
    }
  }

  private _mapOrder(order: any): DisplayOrderDTO {
    return {
      ...order,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
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
