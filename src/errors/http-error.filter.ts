import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const status = exception.getStatus();

//     console.log(response);
//     // response.status(status).json({
//     //   statusCode: status,
//     //   timestamp: new Date().toISOString(),
//     //   path: request.url,
//     // });
//   }
// }
export class HttpExceptionFilter implements ExceptionFilter {
  constructor() {
    // this.logger = new Logger();
  }

  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    // || exception.message?.error
    const devErrorResponse: any = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorName: exception?.name,
      message: exception?.message,
    };

    const prodErrorResponse: any = {
      statusCode,
      message,
    };
    Logger.error(
      `request method: ${request.method} request url${request.url}`,
      JSON.stringify(devErrorResponse),
    );
    response
      .status(statusCode)
      .json(
        process.env.NODE_ENV === 'development'
          ? devErrorResponse
          : prodErrorResponse,
      );
  }
}
