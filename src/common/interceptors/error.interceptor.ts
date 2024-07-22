import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';

import { LoggerService } from 'src/shared/services/logger.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(
    context: ExecutionContext,
    next: import('@nestjs/common').CallHandler
  ): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const request = context.switchToHttp().getRequest();

        this.loggerService.logError(request, error);

        if (error instanceof BadGatewayException) {
          throw new HttpException(
            { success: false, message: error.message, error: 'bad_gateway' },
            HttpStatus.BAD_GATEWAY
          );
        } else if (error instanceof NotFoundException) {
          throw new HttpException(
            { success: false, message: error.message, error: 'not_found' },
            HttpStatus.NOT_FOUND
          );
        } else if (error instanceof BadRequestException) {
          if (error.getResponse && typeof error.getResponse === 'function') {
            const response: any = error.getResponse();
            if (
              response &&
              typeof response === 'object' &&
              'message' in response
            ) {
              const responseMessage = response.message;

              if (response?.data) {
                throw new HttpException(
                  {
                    success: false,
                    message: responseMessage,
                    data: response.data,
                    error: 'bad_request'
                  },
                  HttpStatus.BAD_REQUEST
                );
              }

              if (
                Array.isArray(responseMessage) &&
                responseMessage.length > 0
              ) {
                const validationErrors = responseMessage;

                throw new HttpException(
                  {
                    success: false,
                    message: validationErrors,
                    error: 'bad_request_validation'
                  },
                  HttpStatus.BAD_REQUEST
                );
              }
            }
          }

          throw new HttpException(
            {
              success: false,
              message: error.message,
              error: 'bad_request'
            },
            HttpStatus.BAD_REQUEST
          );
        } else if (error instanceof ConflictException) {
          throw new HttpException(
            { success: false, message: error.message, error: 'conflict' },
            HttpStatus.CONFLICT
          );
        } else if (error instanceof UnauthorizedException) {
          throw new HttpException(
            { success: false, message: error.message, error: 'unauthorized' },
            HttpStatus.UNAUTHORIZED
          );
        } else {
          throw new HttpException(
            { success: false, message: 'Internal Server Error' },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      })
    );
  }
}
