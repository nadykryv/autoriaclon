import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { Strategy, JwtFromRequestFunction } from 'passport-jwt';
import { RequestWithCookies } from '../../../common/interfaces/request-with-cookies.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: ConfigService) {
    const secret =
      configService.get<string>('JWT_REFRESH_SECRET') || 'refresh_secret';

    const jwtFromRequest: JwtFromRequestFunction = (
      req: RequestWithCookies,
    ) => {
      return req.cookies?.refresh_token || null;
    };

    super({
      jwtFromRequest,
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      permissions: payload.permissions,
    };
  }
}
