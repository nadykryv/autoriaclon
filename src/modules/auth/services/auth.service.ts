import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../../database/entities/user.entity';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { CreateUserDto } from '../../users/dto/req/create-user.dto';
import { AuthTokenPair } from '../../../common/interfaces/auth-tokens.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const userObj = { ...user };
      delete userObj.password;
      return userObj;
    }
    return null;
  }

  async login(user: User): Promise<AuthTokenPair> {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      roles: user.roles?.map((r) => r.name) || [],
      permissions:
        user.roles?.flatMap((r) => r.permissions?.map((p) => p.name) || []) ||
        [],
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '60m' });
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    await this.usersService.update(user.id, { hashedRefreshToken });

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accountType: user.accountType,
        roles: user.roles?.map((r) => r.name) || [],
      },
    };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      roles: user.roles?.map((r) => r.name) || [],
      permissions:
        user.roles?.flatMap((r) => r.permissions?.map((p) => p.name) || []) ||
        [],
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const new_refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(new_refresh_token, 10);
    await this.usersService.update(user.id, { hashedRefreshToken });

    return { access_token, refresh_token: new_refresh_token };
  }

  async logout(userId: string) {
    await this.usersService.update(userId, { hashedRefreshToken: null });
  }
}
