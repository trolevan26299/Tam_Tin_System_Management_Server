import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionInfo } from '@app/interfaces/response.interface';

export class CustomError extends HttpException {
  constructor(options: ExceptionInfo, statusCode?: HttpStatus) {
    super(options, statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
