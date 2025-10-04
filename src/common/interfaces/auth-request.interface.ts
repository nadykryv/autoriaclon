import { Request } from 'express';
import { RequestUser } from './request.interface';

export interface AuthRequest extends Request {
  user: RequestUser;
}