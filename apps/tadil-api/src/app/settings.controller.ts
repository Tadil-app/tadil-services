import { BadRequestException, Body, Controller, Get, Put } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import type { PlatformSettings } from '@tadil-common';
import { DataReader, getPlatformSettings } from '@tadil-database';
import { RequirePermissions } from './auth/decorators/permissions.decorator';

export class PlatformSettingsDTO implements PlatformSettings {
  @ApiProperty({ description: 'Items total (SAR) from which delivery is free' })
  freeDeliveryThreshold!: number;

  @ApiProperty({ description: 'Paid to the driver per trip (SAR)' })
  courierBasePayout!: number;

  @ApiProperty({ description: "Tailor's share of the items total (%)" })
  tailorCommissionRate!: number;

  @ApiProperty({ description: 'Share of the items total per trip that offsets the delivery fee (%)' })
  courierCommissionRate!: number;
}

@Controller('settings')
@ApiTags('Settings')
export class SettingsController {
  constructor(private readonly _dataReader: DataReader) {}

  @Get()
  @RequirePermissions('settings.read')
  get(): Promise<PlatformSettings> {
    return getPlatformSettings(this._dataReader.queries);
  }

  @Put()
  @RequirePermissions('settings.read', 'settings.update')
  async update(@Body() dto: PlatformSettingsDTO): Promise<PlatformSettings> {
    // No global ValidationPipe in this app, so the money rules are checked here.
    const amount = (v: unknown, max = Infinity) =>
      typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= max;
    if (
      !amount(dto?.freeDeliveryThreshold) ||
      !amount(dto?.courierBasePayout) ||
      !amount(dto?.tailorCommissionRate, 100) ||
      !amount(dto?.courierCommissionRate, 100)
    ) {
      throw new BadRequestException(
        'Amounts must be numbers of 0 or more, and percentages between 0 and 100'
      );
    }
    const data = {
      freeDeliveryThreshold: dto.freeDeliveryThreshold,
      courierBasePayout: dto.courierBasePayout,
      tailorCommissionRate: dto.tailorCommissionRate,
      courierCommissionRate: dto.courierCommissionRate,
    };
    await this._dataReader.queries.platformSettings.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
    return data;
  }
}
