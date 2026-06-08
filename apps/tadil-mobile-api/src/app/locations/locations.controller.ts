import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DataReader } from '@tadil-database';
import { DisplayCityDTO, DisplayDistrictDTO } from './dtos';

@Controller('locations')
@ApiTags('Locations')
export class LocationsController {
  constructor(private readonly _dataReader: DataReader) {}

  @Get('cities')
  @ApiOkResponse({ type: DisplayCityDTO, isArray: true })
  @ApiQuery({ name: 'search', type: 'string', required: false })
  @ApiQuery({ name: 'regionId', type: 'number', required: false })
  async getCities(
    @Query('search') search?: string,
    @Query('regionId') regionId?: string
  ): Promise<DisplayCityDTO[]> {
    const term = search?.trim();
    const cities = await this._dataReader.queries.city.findMany({
      where: {
        regionId: regionId ? Number(regionId) : undefined,
        OR: term
          ? [
              { nameAr: { contains: term, mode: 'insensitive' } },
              { nameEn: { contains: term, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy: { nameEn: 'asc' },
      take: 50,
    });

    return cities.map((city) => ({
      id: city.id,
      regionId: city.regionId,
      arabicName: city.nameAr,
      englishName: city.nameEn,
    }));
  }

  @Get('cities/:cityId/districts')
  @ApiParam({ name: 'cityId', type: 'number' })
  @ApiOkResponse({ type: DisplayDistrictDTO, isArray: true })
  async getDistricts(
    @Param('cityId') cityId: string
  ): Promise<DisplayDistrictDTO[]> {
    const districts = await this._dataReader.queries.district.findMany({
      where: { cityId: Number(cityId) },
      orderBy: { nameEn: 'asc' },
    });

    return districts.map((district) => ({
      id: district.id,
      cityId: district.cityId,
      arabicName: district.nameAr,
      englishName: district.nameEn,
    }));
  }
}
