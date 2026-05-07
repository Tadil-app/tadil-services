import { Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  GetPendingLoginRequestsUseCase,
  ApproveLoginRequestUseCase,
  RejectLoginRequestUseCase,
} from '@tadil-auth';

@Controller('login-requests')
@ApiTags('Login Requests')
export class LoginRequestsController {
  constructor(
    private readonly _getPendingLoginRequestsUseCase: GetPendingLoginRequestsUseCase,
    private readonly _approveLoginRequestUseCase: ApproveLoginRequestUseCase,
    private readonly _rejectLoginRequestUseCase: RejectLoginRequestUseCase
  ) {}

  @Get('/pending')
  @ApiOperation({ summary: 'Get all pending login requests' })
  async getPending() {
    return this._getPendingLoginRequestsUseCase.execute();
  }

  @Post('/:id/approve')
  @ApiOperation({ summary: 'Approve a login request' })
  async approve(@Param('id') id: string) {
    return this._approveLoginRequestUseCase.execute(id);
  }

  @Post('/:id/reject')
  @ApiOperation({ summary: 'Reject a login request' })
  async reject(@Param('id') id: string) {
    return this._rejectLoginRequestUseCase.execute(id);
  }
}
