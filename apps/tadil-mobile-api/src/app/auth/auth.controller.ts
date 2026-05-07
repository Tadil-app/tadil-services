import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginUseCase, CompleteProfileUseCase } from '@tadil-auth';
import { AuthResponseDto, LoginDto, CompleteProfileDto } from './dtos';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly _loginUseCase: LoginUseCase,
    private readonly _completeProfileUseCase: CompleteProfileUseCase
  ) {}

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
