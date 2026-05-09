import { Controller, Get, Post, Param, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  FulfillPayoutUseCase,
  RejectPayoutUseCase,
  type WalletRepository,
} from '@tadil-wallet';

@Controller('payout-requests')
@ApiTags('Payout Requests')
export class PayoutRequestsController {
  constructor(
    @Inject('WalletRepository')
    private readonly _walletRepository: WalletRepository,
    private readonly _fulfillPayoutUseCase: FulfillPayoutUseCase,
    private readonly _rejectPayoutUseCase: RejectPayoutUseCase
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all pending payout requests' })
  async getPending() {
    return this._walletRepository.getPendingPayoutRequests();
  }

  @Post('/:id/fulfill')
  @ApiOperation({ summary: 'Mark a payout request as fulfilled' })
  async fulfill(@Param('id') id: string) {
    await this._fulfillPayoutUseCase.execute(id);
  }

  @Post('/:id/reject')
  @ApiOperation({ summary: 'Reject a payout request' })
  async reject(@Param('id') id: string) {
    await this._rejectPayoutUseCase.execute(id);
  }
}
