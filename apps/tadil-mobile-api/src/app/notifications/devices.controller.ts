import { BadRequestException, Body, Controller, Delete, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { DeviceTokens } from '@tadil-notifications';
import { AuthGuard } from '../auth/auth.guard';

export class RegisterDeviceDto {
  @ApiProperty({ description: 'Firebase Cloud Messaging registration token' })
  token!: string;

  @ApiProperty({ enum: ['ios', 'android'] })
  platform!: 'ios' | 'android';

  @ApiPropertyOptional({ enum: ['ar', 'en', 'ur', 'hi', 'bn'] })
  locale?: string;
}

@Controller('devices')
@ApiTags('Devices')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class DevicesController {
  constructor(private readonly _deviceTokens: DeviceTokens) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Register this phone for push notifications' })
  async register(@Req() req: any, @Body() dto: RegisterDeviceDto): Promise<void> {
    const token = typeof dto?.token === 'string' ? dto.token.trim() : '';
    if (!token || token.length > 4096) {
      throw new BadRequestException('A push token is required');
    }
    if (dto.platform !== 'ios' && dto.platform !== 'android') {
      throw new BadRequestException('platform must be ios or android');
    }
    await this._deviceTokens.register(req.user.sub, token, dto.platform, dto.locale);
  }

  @Delete(':token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Stop push notifications to this phone (sign-out)' })
  async unregister(@Req() req: any, @Param('token') token: string): Promise<void> {
    await this._deviceTokens.unregister(req.user.sub, token);
  }
}
