import {
  Controller,
  Post,
  UseGuards,
  Body,
  Res,
  Req,
  //UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from '../users/dto/req/create-user.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';
import { Response, Request } from 'express';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { User } from '../../database/entities/user.entity';
import { RequestWithCookies } from '../../common/interfaces/request-with-cookies.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Log in to the system' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(user);

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 giorni
    });

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: tokens.user,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @CurrentUser() userData: JwtPayload,
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    const tokens = await this.authService.refresh(userData.sub, refreshToken);

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 giorni
    });

    return { access_token: tokens.access_token };
  }

  @ApiBearerAuth()
  @Post('logout')
  async logout(
    @CurrentUser() userData: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(userData.sub);

    res.clearCookie('refresh_token', { path: '/auth/refresh' });

    return { message: 'Logged out' };
  }
}
