import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation, ApiNoContentResponse } from '@nestjs/swagger';
import { RequestOtpUseCase, VerifyOtpUseCase } from '@tadil-auth';
import { AuthResponseDto, RequestOtpDto, VerifyOtpDto } from './dtos';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly _requestOtpUseCase: RequestOtpUseCase,
    private readonly _verifyOtpUseCase: VerifyOtpUseCase
  ) {}

  @Post('/login')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Request an OTP code via SMS for login' })
  @ApiNoContentResponse({
    description: 'OTP has been successfully sent via SMS.',
  })
  async requestOtp(@Body() dto: RequestOtpDto): Promise<void> {
    await this._requestOtpUseCase.execute(dto.phone);
  }

  @Post('/verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP code and receive JWT token' })
  @ApiOkResponse({
    description: 'Authentication successful',
    type: AuthResponseDto,
  })
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<AuthResponseDto> {
    const result = await this._verifyOtpUseCase.execute(dto.phone, dto.code);
    return {
      token: result.token,
      user: {
        id: result.user.id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        phone: result.user.phone,
        role: result.user.role,
        email: result.user.email ?? undefined,
      },
    };
  }
}
