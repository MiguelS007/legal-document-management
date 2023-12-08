import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { DateTimeService, Helpers } from '../../common';
import { AdapterService } from '../services';

describe('AdapterService', () => {
  let service: AdapterService;
  let module: TestingModule;
  let configService: Partial<ConfigService>;
  let dateTimeService: Partial<DateTimeService>;
  let helperService: Partial<Helpers>;

  beforeEach(async () => {
    const logger: Partial<Logger> = {
      error: () => {
        return;
      },
      debug: () => {
        return;
      },
      log: () => {
        return;
      },
      warn: () => {
        return;
      },
    };

    configService = {
      get: () => '293',
    };

    dateTimeService = {
      convertDateStringInMilliseconds: () => {
        return 0;
      },
    };

    helperService = {
      calculateDiscountProduct: () => {
        return {} as any;
      },
      convertNumberInCurrency: 10 as any,
      getImage: () => {
        return {} as any;
      },
      getPaymentInfo: () => {
        return {} as any;
      },
      getPrice: () => {
        return {} as any;
      },
    };

    module = await Test.createTestingModule({
      providers: [
        AdapterService,
        { provide: Logger, useValue: logger },
        { provide: DateTimeService, useValue: dateTimeService },
        { provide: ConfigService, useValue: configService },
        { provide: Helpers, useValue: helperService },
      ],
    }).compile();

    service = module.get<AdapterService>(AdapterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
