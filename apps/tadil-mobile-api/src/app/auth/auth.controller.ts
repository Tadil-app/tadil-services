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
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginUseCase, CompleteProfileUseCase } from '@tadil-auth';
import {
  AuthResponseDto,
  LoginDto,
  CompleteProfileDto,
  UpdateProfileDto,
} from './dtos';
import { AuthGuard } from './auth.guard';
import { type UsersRepository } from '@tadil-users';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly _loginUseCase: LoginUseCase,
    private readonly _completeProfileUseCase: CompleteProfileUseCase,
    @Inject('UsersRepository')
    private readonly _usersRepository: UsersRepository
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
      user: result.user
        ? {
            id: result.user.id,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            phone: result.user.phone,
            role: result.user.role,
            email: result.user.email ?? undefined,
          }
        : undefined,
    };
  }

  @Put('/complete-profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete skeleton user profile' })
  @ApiOkResponse({
    description: 'Profile completed and authenticated',
    type: AuthResponseDto,
  })
  async completeProfile(
    @Body() dto: CompleteProfileDto
  ): Promise<AuthResponseDto> {
    const result = await this._completeProfileUseCase.execute(
      dto.phone,
      dto.firstName,
      dto.lastName
    );
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
