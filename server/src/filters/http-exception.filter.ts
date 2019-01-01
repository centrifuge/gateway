import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import * as path from 'path';

@Catch(HttpException, Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    if (
      status === 404 &&
      request.headers.accept &&
      request.headers.accept.indexOf('text/html') !== -1
    ) {
      return response.sendFile(path.resolve('./build/index.html'));
    }

    return response.status(exception.getStatus()).json(exception.getResponse());
  }
}
