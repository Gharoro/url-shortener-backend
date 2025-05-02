import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        if (request.url.includes('health')) return data;

        const statusCode = response.statusCode ?? HttpStatus.OK;
        const { message, ...rest } = data || {};
        return {
          success: true,
          statusCode,
          message: message || 'Success',
          data: Object.keys(rest).length ? rest : null,
        };
      }),
    );
  }
}
