import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    console.log('TransformInterceptor - Method:', request.method);
    console.log('TransformInterceptor - URL:', request.url);

    return next.handle().pipe(
      map((data: any) => {
        // Si les données sont déjà formatées avec { data, message, etc. }
        if (data && typeof data === 'object' && 'data' in data) {
          return data;
        }

        // Sinon, on wrap les données
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
          data: data
        };
      })
    );
  }
}

interface Response<T> {
  statusCode: number;
  timestamp: string;
  path: string;
  data: T;
}