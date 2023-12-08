import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { BaseResponse } from './base.response';

export class BaseController {
  protected contextName: string;
  protected correlationId: string;
  constructor(protected readonly logger: Logger) {}

  public async safeExecute(action: any, correlationId: string): Promise<any> {
    try {
      this.correlationId = correlationId;
      this.callInitLogger();

      const data = await action();

      this.callEndLogger();
      const response = new BaseResponse(data);
      return response;
    } catch (error) {
      const response = new BaseResponse();

      const statusCode = this.getStatusCode(error);

      this.callLoggerError(error);

      const httpException = this.getErrorFlowFromStatusCode()[statusCode];

      if (httpException) throw httpException(response);

      this.callGenericErrorFlow(response);
    }
  }

  private callEndLogger() {
    this.logger.debug({
      message: `Finalizing request from correlation: ${this.correlationId}`,
      metadata: {
        correlationId: this.correlationId,
      },
    });
  }

  private callInitLogger() {
    this.logger.debug({
      message: `Initializing request from correlation: ${this.correlationId}`,
      metadata: {
        correlationId: this.correlationId,
      },
    });
  }

  private callGenericErrorFlow(response: BaseResponse<unknown>) {
    response.addError({
      message: 'Internal Server Error',
    });

    throw new InternalServerErrorException(response);
  }

  private callLoggerError(error: any) {
    this.logger.error(error);
    this.logger.error({
      message: `Terminating request prematurely from correlation: ${this.correlationId}`,
      metadata: {
        correlationId: this.correlationId,
      },
    });
  }

  private getStatusCode(error: any) {
    return (
      error.status ||
      error.response?.statusCode ||
      error.response?.status ||
      500
    );
  }

  private getErrorFlowFromStatusCode() {
    return {
      ...this.loadBadRequestFlow(),
      ...this.loadUnprocessableEntityFlow(),
      ...this.loadUnauthorizedFlow(),
      ...this.loadNotFoundFlow(),
    };
  }

  private loadBadRequestFlow() {
    return {
      400: (response) => {
        response.addError({
          message: 'Request has structure errors',
        });
        return new BadRequestException(response);
      },
    };
  }

  private loadUnprocessableEntityFlow() {
    return {
      422: (response) => {
        response.addError({
          message: 'Request has structure errors',
        });
        return new UnprocessableEntityException(response);
      },
    };
  }

  private loadUnauthorizedFlow() {
    return {
      401: (response) => {
        response.addError({
          message: 'Not Authorized',
        });
        return new UnauthorizedException(response);
      },
    };
  }

  private loadNotFoundFlow() {
    return {
      404: (response) => {
        response.addError({
          message: 'Not Found',
        });
        return new NotFoundException(response);
      },
    };
  }
}
