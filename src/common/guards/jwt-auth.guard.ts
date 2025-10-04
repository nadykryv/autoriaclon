import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<RequestWithUser>();
    console.log('📌 Headers ricevuti:', req.headers);

    const authHeader =
      req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader) {
      console.warn('⚠️ Nessun header Authorization trovato');
      throw new UnauthorizedException('Authorization header missing');
    }

    const authHeaderStr = Array.isArray(authHeader)
      ? authHeader[0]
      : authHeader;

    const token = authHeaderStr.split(' ')[1];
    if (!token) {
      console.warn('⚠️ Nessun token nel header Authorization');
      throw new UnauthorizedException('Token missing');
    }

    console.log('📌 Token ricevuto:', token);

    const can = (await super.canActivate(context)) as boolean;

    console.log('📌 JwtAuthGuard - req.user:', req.user);
    if (!req.user) {
      console.warn('⚠️ req.user è undefined dopo super.canActivate');
    }

    return can;
  }
}
