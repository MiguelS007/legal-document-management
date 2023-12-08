import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { DateTimeService, TriggerService } from '../../common';
import { AdapterService, DocumentService } from '../services';
import { IProductStampPartner } from '../interfaces';
import *  from '../enums';
import { PayloadValidator } from '../../validators';

describe('DocumentService', () => {
  let service: DocumentService;
  let module: TestingModule;
  let configService: Partial<ConfigService>;
  let dateTimeService: Partial<DateTimeService>;
  let adapterService: Partial<AdapterService>;
  let triggerService: Partial<TriggerService>;
  let payloadService: Partial<PayloadValidator>;
  let adapterTriggerService: Partial<AdapterTriggerService>;

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

    payloadService = {
      validateErrors: () => {
        return;
      },
      validatePayload: async () => {
        return;
      },
    };
    
    triggerService = {
      dispatchTrigger: async () => {
        return {} as IProductStampPartner[];
      },
      dispatchTriggers: async () => {
        return [] as any[];
      },
    };

    adapterService = {
      mount: () => ''
    };

    configService = {
      get: () => '293',
    };

    module = await Test.createTestingModule({
      providers: [
        CatalogService,
        { provide: Logger, useValue: logger },
        { provide: DateTimeService, useValue: dateTimeService },
        { provide: ConfigService, useValue: configService },
        { provide: AdapterService, useValue: adapterService },
        { provide: TriggerService, useValue: triggerService },
        { provide: AdapterTriggerService, useValue: adapterTriggerService },
        { provide: PayloadValidator, useValue: payloadService },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
