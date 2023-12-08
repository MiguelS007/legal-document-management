import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';

import * as Joi from 'joi';

@Injectable()
export class PayloadValidator {
  private readonly contextService = PayloadValidator.name;
  constructor(private readonly logger: Logger) {}

  public async validatePayload({
    objectValidator,
    data,
    correlationId,
  }: {
    objectValidator: Joi.ObjectSchema<any>;
    data: any;
    correlationId: string;
  }) {
    try {
      this.logger.debug(
        {
          message: `Prepare to validate message payload. CorrelationId: ${correlationId}`,
          metadata: {
            correlationId,
          },
        },
        this.contextService,
      );

      const payloadValidated = await objectValidator.validateAsync(data);

      this.logger.debug(
        {
          message: `Message payload validated. CorrelationId: ${correlationId}`,
          metadata: {
            correlationId,
          },
        },
        this.contextService,
      );

      return payloadValidated;
    } catch (e) {
      this.logger.warn(
        {
          message: `Message payload failed to pass validation. CorrelationId: ${correlationId}.`,
          metadata: {
            correlationId,
            errorMessage: e.message || e,
            errorName: e.name,
            stackTrace: e.stack,
          },
        },
        this.contextService,
      );

      throw new HttpException(e?.name || e, HttpStatus.BAD_REQUEST);
    }
  }

  public validateErrors({
    data,
    correlationId,
  }: {
    data: any;
    clusterId?: string;
    skuId?: number;
    correlationId: string;
  }) {
    if (data?.errors) {
      this.logger.debug(
        {
          message: `The call partner was error ocurred. Correlation ID: ${correlationId}`,
          metadata: {
            correlationId,
            errors: data.errors,
          },
        },
        this.contextService,
      );

      throw new HttpException(
        'Error when call partner',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
