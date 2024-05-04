/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as APP_CONFIG from '../app.config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verify(token, {
        secret: APP_CONFIG.AUTH.jwtSecret,
      });
      request['user_data'] = payload;
    } catch (error) {
      throw new HttpException(
        {
          status: 419,
          message: 'Token expired !',
        },
        419,
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization
      ? request.headers.authorization.split(' ')
      : [];

    return type === 'Bearer' ? token : undefined;
  }
}
