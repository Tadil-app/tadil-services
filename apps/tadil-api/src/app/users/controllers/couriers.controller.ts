import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DataReader } from '@tadil-database';
import { CreateUserDTO, DisplayUserDTO, UpdateUserDTO } from '../dtos';
import {
  ROLE,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '@tadil-users';

@Controller('couriers')
@ApiTags('Couriers')
export class CouriersController {
  constructor(
    private readonly _dataReader: DataReader,
    private readonly _createUserUseCase: CreateUserUseCase,
    private readonly _updateUserUseCase: UpdateUserUseCase,
    private readonly _deleteUserUseCase: DeleteUserUseCase
  ) {}

  @Get('/')
  @ApiOkResponse({ type: DisplayUserDTO, isArray: true })
  async getCouriers(): Promise<DisplayUserDTO[]> {
    const users = await this._dataReader.queries.user.findMany({
      where: { role: ROLE.COURIER },
      include: { addresses: true },
    });

    return users.map((user) => ({
      ...user,
      email: user.email ?? undefined,
      cityNameAr: user.addresses.length > 0 ? user.addresses[0].cityNameAr : undefined,
      cityNameEn: user.addresses.length > 0 ? user.addresses[0].cityNameEn : undefined,
      cityNameBn: user.addresses.length > 0 ? user.addresses[0].cityNameBn : undefined,
      cityNameHi: user.addresses.length > 0 ? user.addresses[0].cityNameHi : undefined,
      cityNameUr: user.addresses.length > 0 ? user.addresses[0].cityNameUr : undefined,
      cityId: user.addresses.length > 0 ? user.addresses[0].cityId ?? undefined : undefined,
      districtId: user.addresses.length > 0 ? user.addresses[0].districtId ?? undefined : undefined,
      districtNameAr: user.addresses.length > 0 ? user.addresses[0].districtNameAr ?? undefined : undefined,
      districtNameEn: user.addresses.length > 0 ? user.addresses[0].districtNameEn ?? undefined : undefined,
      districtNameBn: user.addresses.length > 0 ? user.addresses[0].districtNameBn ?? undefined : undefined,
      districtNameHi: user.addresses.length > 0 ? user.addresses[0].districtNameHi ?? undefined : undefined,
      districtNameUr: user.addresses.length > 0 ? user.addresses[0].districtNameUr ?? undefined : undefined,
      street: user.addresses.length > 0 ? user.addresses[0].street ?? undefined : undefined,
      streetAr: user.addresses.length > 0 ? user.addresses[0].streetAr ?? undefined : undefined,
      streetEn: user.addresses.length > 0 ? user.addresses[0].streetEn ?? undefined : undefined,
      streetBn: user.addresses.length > 0 ? user.addresses[0].streetBn ?? undefined : undefined,
      streetHi: user.addresses.length > 0 ? user.addresses[0].streetHi ?? undefined : undefined,
      streetUr: user.addresses.length > 0 ? user.addresses[0].streetUr ?? undefined : undefined,
      latitude: user.addresses.length > 0 ? user.addresses[0].latitude ?? undefined : undefined,
      longitude: user.addresses.length > 0 ? user.addresses[0].longitude ?? undefined : undefined,
    }));
  }


  @Get('/phone/:phone')
  @ApiOkResponse({ type: DisplayUserDTO })
  async getCourierByPhone(
    @Param('phone') phone: string
  ): Promise<DisplayUserDTO | undefined> {
    const user = await this._dataReader.queries.user.findUnique({
      where: { phone },
    });

    if (!user) return undefined;
    return {
      ...user,
      email: user.email ?? undefined,
    };
  }

  @Post('/create')
  async createCourier(@Body() courier: CreateUserDTO): Promise<void> {
    console.log(courier);
    await this._createUserUseCase.execute({
      ...courier,
      role: ROLE.COURIER,
    });
  }

  @Get('/:id')
  @ApiOkResponse({ type: DisplayUserDTO })
  async getCourierById(
    @Param('id') id: string
  ): Promise<DisplayUserDTO | undefined> {
    const user = await this._dataReader.queries.user.findUnique({
      where: { id },
    });

    if (!user) return undefined;
    return {
      ...user,
      email: user.email ?? undefined,
    };
  }

  @Put('/:id/update')
  async updateCourier(
    @Param('id') id: string,
    @Body() courier: UpdateUserDTO
  ): Promise<void> {
    await this._updateUserUseCase.execute({
      ...courier,
      id: id,
    });
  }

  @Delete('/:id/delete')
  async deleteCourier(@Param('id') id: string): Promise<void> {
    await this._deleteUserUseCase.execute({ id });
  }
}
