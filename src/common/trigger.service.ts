import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TriggerService {
  private readonly contextService = TriggerService.name;
  constructor(
    private readonly logger: Logger,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async dispatchTriggers(triggers: any[]) {
    return await Promise.all(
      triggers.map((trigger) => {
        return this.dispatchTrigger({ ...trigger });
      }),
    );
  }

  public async dispatchTrigger({
    body,
    headers,
    method,
    url,
    dataLogger,
  }: {
    body: any;
    headers: any;
    method: string;
    url: string;
    dataLogger: any;
  }): Promise<any> {
    const { correlationId, action } = dataLogger;
    try {
      this.logger.log(
        {
          message: `Attempting to create trigger for ${action}. Correlation ID: ${correlationId}`,
          metadata: {
            correlationId,
            ...dataLogger,
          },
        },
        this.contextService,
      );

      const triggerMounted = this.createTriggerRequest({
        method,
        data: body,
        url,
        headers,
      });

      const { data } = await lastValueFrom(triggerMounted);

      this.logger.log(
        {
          message: `Trigger for ${action} created successfully. Correlation ID: ${correlationId}`,
          metadata: {
            correlationId,
            ...dataLogger,
          },
        },
        this.contextService,
      );

      return data;
    } catch (error) {
      this.logger.warn(
        {
          message: `Failed to create trigger for ${action}. Correlation ID: ${correlationId}`,
          metadata: {
            correlationId,
            error,
            ...dataLogger,
          },
        },
        this.contextService,
      );

      throw error;
    }
  }

  private createTriggerRequest({
    method,
    data,
    url,
    headers,
  }: {
    url: string;
    headers: any;
    method: string;
    data: any;
  }) {
    return this.httpService.request({
      method,
      timeout: this.configService.get<number>('http.timeout'),
      url,
      headers,
      data,
    });
  }
}
