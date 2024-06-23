/* eslint-disable prettier/prettier */
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { isDevEnv } from '@app/app.environment';
import logger from '@app/utils/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    if (!isDevEnv) {
      return next.handle();
    }
    const request = context.switchToHttp().getRequest<Request>();
    const content = request.method + ' -> ' + request.url;
    logger.debug('+++ req：', content);
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => logger.debug('--- res：', content, `${Date.now() - now}ms`)),
      );
  }
}
