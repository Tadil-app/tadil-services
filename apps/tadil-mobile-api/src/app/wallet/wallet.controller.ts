import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetWalletDetailsUseCase, RequestPayoutUseCase } from '@tadil-wallet';
import { AuthGuard } from '../auth/auth.guard';

@Controller('wallet')
@ApiTags('Wallet')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(
    private readonly _getWalletDetailsUseCase: GetWalletDetailsUseCase,
    private readonly _requestPayoutUseCase: RequestPayoutUseCase
  ) {}

  @Get('/:userId')
  @ApiOperation({ summary: 'Get wallet details (balance and transactions)' })
  async getDetails(@Param('userId') userId: string) {
    return this._getWalletDetailsUseCase.execute(userId);
  }

  @Post('/:userId/payout')
  @ApiOperation({ summary: 'Submit a payout request' })
  async requestPayout(
    @Param('userId') userId: string,
    @Body('amount') amount: number
  ) {
    await this._requestPayoutUseCase.execute({ userId, amount });
  }
}
