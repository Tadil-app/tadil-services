import { Controller, Get, Post, Param, Body, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetWalletDetailsUseCase, RequestPayoutUseCase } from '@tadil-wallet';
import { AuthGuard } from '../auth/auth.guard';
import { RequestPayoutDto } from './dtos';

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
  async getDetails(@Req() req: any, @Param('userId') userId: string) {
    this._assertOwnWallet(req, userId);
    return this._getWalletDetailsUseCase.execute(userId);
  }

  @Post('/:userId/payout')
  @ApiOperation({ summary: 'Submit a payout request' })
  async requestPayout(
    @Req() req: any,
    @Param('userId') userId: string,
    @Body() dto: RequestPayoutDto
  ) {
    this._assertOwnWallet(req, userId);
    await this._requestPayoutUseCase.execute({ userId, amount: Number(dto.amount) });
  }

  /** Users may only see, or withdraw from, their own wallet. */
  private _assertOwnWallet(req: any, userId: string) {
    if (req.user?.sub !== userId) {
      throw new ForbiddenException();
    }
  }
}
