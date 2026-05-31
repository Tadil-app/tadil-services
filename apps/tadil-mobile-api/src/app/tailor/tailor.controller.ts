import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { DataReader } from '@tadil-database';
import { DisplayOrderDTO } from './dtos/order';
import { InformationType } from '../customer/dtos';
import { 
  AcceptOrderUseCase, 
  DeclineOrderUseCase, 
  ConfirmReceiptUseCase, 
  MarkOrderReadyUseCase 
} from '@tadil-tailor';

@Controller('tailor/:id')
@ApiTags('Tailor')
export class TailorController {
  constructor(
    private readonly _dataReader: DataReader,
    private readonly _acceptOrderUseCase: AcceptOrderUseCase,
    private readonly _declineOrderUseCase: DeclineOrderUseCase,
    private readonly _confirmReceiptUseCase: ConfirmReceiptUseCase,
    private readonly _markReadyUseCase: MarkOrderReadyUseCase
  ) {}

  @Get('/orders')
  @ApiOkResponse({ type: DisplayOrderDTO, isArray: true })
  async getOrders(@Param('id') tailorId: string): Promise<DisplayOrderDTO[]> {
    // 1. Fetch tailor's city
    const tailorAddress = await this._dataReader.queries.address.findFirst({
      where: { userId: tailorId },
      select: { city: true },
    });

    if (!tailorAddress) {
      return []; // No address, no orders
    }

    const tailorCity = tailorAddress.city;

    // 2. Fetch orders within that city
    const orders = await this._dataReader.queries.order.findMany({
      where: {
        OR: [
          {
            AND: [
              { status: 'waitingForTailorAssignement' },
              { address: { city: tailorCity } },
              { NOT: { rejectedTailors: { some: { id: tailorId } } } }
            ],
          },
          { assignedTailorId: tailorId },
        ],
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
  @ApiOperation({ summary: 'Accept a tailor assignment' })
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
  @ApiOperation({ summary: 'Decline a tailor assignment' })
  async declineOrder(
    @Param('id') tailorId: string,
    @Param('orderId') orderId: string
  ) {
    await this._declineOrderUseCase.execute({
      tailorId,
      orderId,
    });
  }

  @Post('/orders/:orderId/confirm-receipt')
  @ApiOperation({ summary: 'Confirm receipt of items from courier' })
  async confirmReceipt(@Param('orderId') orderId: string) {
    await this._confirmReceiptUseCase.execute({ orderId });
  }

  @Post('/orders/:orderId/mark-ready')
  @ApiOperation({ summary: 'Mark work as ready for return courier' })
  async markReady(@Param('orderId') orderId: string) {
    await this._markReadyUseCase.execute({ orderId });
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
          })),
        })),
      })),
      history: order.history || [],
    };
  }
}
