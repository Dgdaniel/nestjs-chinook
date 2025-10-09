import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class AppExceptionFilter implements ExceptionFilter{
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp().getRequest();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const cause = exception.getCause();
    const status = exception.status;

    return response.status(status).json({
      status,
      timestamp: new Date().toISOString(),
      path: request.path,
    })
  }
}