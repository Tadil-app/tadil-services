import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DataReader } from '@tadil-database';
import { AssignTailorManuallyUseCase } from '@tadil-orders';
import { DisplayOrderDto } from './dtos/displayOrder.dto';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(
    private readonly _dataReader: DataReader,
    private readonly _assignTailorUseCase: AssignTailorManuallyUseCase
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all orders with optional filtering' })
  @ApiOkResponse({ type: DisplayOrderDto, isArray: true })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'tailorId', required: false })
  @ApiQuery({ name: 'courierId', required: false })
  async getOrders(
    @Query('status') status?: string,
    @Query('tailorId') tailorId?: string,
    @Query('courierId') courierId?: string
  ): Promise<DisplayOrderDto[]> {
    const orders = await this._dataReader.queries.order.findMany({
      where: {
        AND: [
          status ? { status: status as any } : {},
          tailorId ? { assignedTailorId: tailorId } : {},
          courierId ? { 
            OR: [
              { assignedCourierId: courierId },
              { assignedReturnCourierId: courierId }
            ]
          } : {},
        ]
      },
      include: {
        customer: true,
        assignedTailor: true,
        assignedCourier: true,
        assignedReturnCourier: true,
        address: true,
        history: { orderBy: { timestamp: 'desc' } },
      },
      orderBy: { date: 'desc' },
    });

    return orders.map((order) => ({
      id: order.id,
      reference: order.reference,
      date: order.date.toISOString(),
      totalPrice: order.totalPrice,
      status: order.status,
      customerId: order.customerId,
      assignedTailorId: order.assignedTailorId ?? undefined,
      assignedCourierId: order.assignedCourierId ?? undefined,
      assignedReturnCourierId: order.assignedReturnCourierId ?? undefined,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      tailorName: order.assignedTailor ? `${order.assignedTailor.firstName} ${order.assignedTailor.lastName}` : undefined,
      courierName: order.assignedCourier ? `${order.assignedCourier.firstName} ${order.assignedCourier.lastName}` : 
                  (order.assignedReturnCourier ? `${order.assignedReturnCourier.firstName} ${order.assignedReturnCourier.lastName}` : undefined),
      city: order.address?.city ?? undefined,
      history: order.history.map(h => ({ status: h.status, timestamp: h.timestamp.toISOString() })),
    }));
  }

  @Post('/:id/assign-tailor')
  @ApiOperation({ summary: 'Manually assign a tailor to an order' })
  async assignTailor(
    @Param('id') id: string,
    @Body('tailorId') tailorId: string
  ): Promise<void> {
    await this._assignTailorUseCase.execute({
      orderId: id,
      tailorId,
    });
  }
}
