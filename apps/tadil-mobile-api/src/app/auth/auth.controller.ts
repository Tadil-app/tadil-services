import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Get,
  Inject,
  Req,
  UseGuards,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoginUseCase, CompleteProfileUseCase } from '@tadil-auth';
import {
  AuthResponseDto,
  LoginDto,
  CompleteProfileDto,
  UpdateProfileDto,
  CreateAddressDto,
  UpdateAddressDto,
  DisplayAddressDto,
} from './dtos';
import { AuthGuard } from './auth.guard';
import {
  AddAddressUseCase,
  UpdateAddressUseCase,
  GetMyAddressesUseCase,
  type UsersRepository,
} from '@tadil-users';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly _loginUseCase: LoginUseCase,
    private readonly _completeProfileUseCase: CompleteProfileUseCase,
    @Inject('UsersRepository')
    private readonly _usersRepository: UsersRepository,
    private readonly _addAddressUseCase: AddAddressUseCase,
    private readonly _updateAddressUseCase: UpdateAddressUseCase,
    private readonly _getMyAddressesUseCase: GetMyAddressesUseCase
  ) {}

  @Get('/me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req: any) {
    const user = await this._usersRepository.getUserById(req.user.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      email: user.email ?? undefined,
      addresses: user.addresses,
    };
  }

  @Put('/me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    const user = await this._usersRepository.getUserById(req.user.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const updatedUser = {
      ...user,
      firstName: dto.firstName ?? user.firstName,
      lastName: dto.lastName ?? user.lastName,
      email: dto.email ?? user.email,
    };

    await this._usersRepository.updateUser(updatedUser);

    return {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phone: updatedUser.phone,
      role: updatedUser.role,
      email: updatedUser.email ?? undefined,
    };
  }

  @Get('/me/addresses')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my addresses' })
  @ApiOkResponse({ type: DisplayAddressDto, isArray: true })
  async getAddresses(@Req() req: any): Promise<DisplayAddressDto[]> {
    const addresses = await this._getMyAddressesUseCase.execute(req.user.sub);
    return addresses.map((a) => ({
      id: a.id,
      cityId: a.cityId ?? undefined,
      cityNameAr: a.cityNameAr,
      cityNameEn: a.cityNameEn,
      districtId: a.districtId ?? undefined,
      districtNameAr: a.districtNameAr,
      districtNameEn: a.districtNameEn,
      street: a.street ?? undefined,
      latitude: a.latitude ?? undefined,
      longitude: a.longitude ?? undefined,
      userId: a.userId,
    }));
  }

  @Post('/me/addresses')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new address' })
  async addAddress(@Req() req: any, @Body() dto: CreateAddressDto) {
    await this._addAddressUseCase.execute({
      userId: req.user.sub,
      ...dto,
    });
  }

  @Put('/me/addresses/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing address' })
  async updateAddress(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto
  ) {
    // We should probably check if the address belongs to the user, but for now
    // the UpdateAddressUseCase only takes the ID.
    await this._updateAddressUseCase.execute({
      id,
      ...dto,
    });
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login or initiate registration with phone number' })
  @ApiOkResponse({
    description: 'Login status returned',
    type: AuthResponseDto,
  })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    const result = await this._loginUseCase.execute(dto.phone);
    return {
      status: result.status,
      token: result.token,
      message: result.message,
      user: result.user ? {
        id: result.user.id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        phone: result.user.phone,
        role: result.user.role,
        email: result.user.email ?? undefined,
      } : undefined,
    };
  }

  @Put('/complete-profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete skeleton user profile' })
  @ApiOkResponse({
    description: 'Profile completed and authenticated',
    type: AuthResponseDto,
  })
  async completeProfile(@Body() dto: CompleteProfileDto): Promise<AuthResponseDto> {
    const result = await this._completeProfileUseCase.execute(dto.phone, dto.firstName, dto.lastName);
    return {
      status: 'authenticated',
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
