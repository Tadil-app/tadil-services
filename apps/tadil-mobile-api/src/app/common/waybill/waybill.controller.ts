import { Controller, Get, Header, Param, Query, UnauthorizedException } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { DataReader } from '@tadil-database';
import { buildWaybill } from './waybill.builder';
import { renderWaybillHtml } from './waybill.html';
import { verifyWaybillToken } from './waybill.link';

/** Serves the printable waybill page behind a signed, short-lived link. */
@Controller('waybill')
@ApiExcludeController()
export class WaybillController {
  constructor(private readonly _dataReader: DataReader) {}

  @Get('/:orderId')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'no-store')
  @Header('X-Robots-Tag', 'noindex')
  async getWaybillPage(
    @Param('orderId') orderId: string,
    @Query('token') token: string,
    @Query('print') print?: string
  ): Promise<string> {
    const link = verifyWaybillToken(token ?? '', orderId);
    if (!link) {
      throw new UnauthorizedException('This waybill link has expired. Open it again from the app.');
    }
    // Access is checked again, so a link stops working once the person is
    // no longer assigned to the order.
    const waybill = await buildWaybill(this._dataReader, orderId, link.viewer, link.sub);
    return renderWaybillHtml(waybill, { autoPrint: print === '1' });
  }
}
