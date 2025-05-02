import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error, please try again';
    let error = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (typeof responseBody === 'object') {
        message = (responseBody as any).message || message;
        error = (responseBody as any).error || null;
      }
    }

    this.logger.error(
      `HTTP ${status} - ${request.method} ${request.url}`,
      JSON.stringify({ message, stack: (exception as any)?.stack }),
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      ...(process.env.NODE_ENV !== 'production' && error ? { error } : {}),
    });
  }
}
