import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { DateTimeService, FirebaseService, TriggerService } from '../../common';
import {
  AdapterService,
  CatalogService,
  AdapterTriggerService,
} from '../services';
import { IProductStampPartner } from '../interfaces';
import { Action } from '../enums';
import { PayloadValidator } from '../../validators';

describe('CatalogService', () => {
  let service: CatalogService;
  let module: TestingModule;
  let configService: Partial<ConfigService>;
  let firebaseService: Partial<FirebaseService>;
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

    adapterTriggerService = {
      mountPayloadToGetBanners: () => {
        return {} as any;
      },
      mountPayloadToGetFilters: () => {
        return {} as any;
      },

      mountPayloadToGetProducts: () => {
        return {} as any;
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
      mountResponseProductClusters: () => {
        return {} as any;
      },
      mountDataToGetProducts: () => {
        return {} as any;
      },
      mountFacets: () => {
        return {} as any;
      },
      mountFacetsString: () => {
        return {} as any;
      },
      mountOrder: () => {
        return {} as any;
      },
      mountPaginationToCallPartner: () => {
        return {} as any;
      },
    };

    configService = {
      get: () => '293',
    };

    firebaseService = {
      publishMessageInTopic: async () => {
        return;
      },
    };

    module = await Test.createTestingModule({
      providers: [
        CatalogService,
        { provide: Logger, useValue: logger },
        { provide: DateTimeService, useValue: dateTimeService },
        { provide: ConfigService, useValue: configService },
        { provide: FirebaseService, useValue: firebaseService },
        { provide: AdapterService, useValue: adapterService },
        { provide: TriggerService, useValue: triggerService },
        { provide: AdapterTriggerService, useValue: adapterTriggerService },
        { provide: PayloadValidator, useValue: payloadService },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProducts', () => {
    it('Should get product by cluster', async () => {
      const product = await service.getProducts({
        action: Action.GET_BY_CLUSTER,
        dataGetProducts: {
          category: 'xpto',
          clusterId: 'xpto',
          seller: 'xpto',
        },
        regionId: 'xpto',
        correlationId: 'xpto',
      });

      expect(product).toEqual({});
    });
  });
});
