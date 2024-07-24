/* eslint-disable prettier/prettier */

import { Request, Response } from 'express';
import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import {
  HttpResponseError,
  ResponseStatus,
} from '../interfaces/response.interface';
import { isProdEnv } from '../app.environment';
import * as TEXT from '../constants/text.constant';

@Injectable()
export class OriginMiddleware implements NestMiddleware {
  allowedOrigins = [
    'https://maydemtientamtin.vercel.app',
    'http://localhost:3000',
    'http://localhost:8081',
  ];

  use(request: Request, response: Response, next) {
    if (isProdEnv) {
      const { origin, referer } = request.headers;

      const isAllowedOrigin = origin
        ? this.allowedOrigins.includes(origin)
        : false;
      const isAllowedReferer = referer
        ? this.allowedOrigins.some((url) => referer.startsWith(url))
        : false;

      if (!isAllowedOrigin && !isAllowedReferer) {
        return response.status(HttpStatus.UNAUTHORIZED).jsonp({
          status: ResponseStatus.Error,
          message: TEXT.HTTP_ANONYMOUS_TEXT,
          error: null,
        } as HttpResponseError);
      }
    }

    return next();
  }
}
