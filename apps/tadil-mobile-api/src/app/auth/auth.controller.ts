import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DataReader } from '@tadil-database';
import { GetOtpCodeDto, VerifyOtpDto } from './dtos';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly _dataReader: DataReader) {}

  @Post('/login')
  @ApiBody({ type: GetOtpCodeDto })
  @ApiOkResponse({ type: VerifyOtpDto })
  async getOtpCode(@Body() body: { phone: string }): Promise<VerifyOtpDto> {
    return {
      code: '123456',
    };
  }

  @Post('/verify-otp')
  @ApiBody({ type: VerifyOtpDto })
  @ApiOkResponse({ type: Boolean })
  async verifyOtp(@Body() body: { code: string }): Promise<boolean> {
    return body.code === '123456';
  }
}
