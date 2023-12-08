import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AdapterService } from './adapter.service';
import { Action } from '../enums';

@Injectable()
export class AdapterTriggerService {
  private readonly contextService = AdapterTriggerService.name;
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly adapterService: AdapterService,
  ) {}

  public mountPayloadToGetProducts({
    data,
    current,
    correlationId,
    filter,
    regionId,
    action,
  }: {
    regionId: string;
    correlationId: string;
    current: number;
    data: any;
    action: Action;
    filter: any;
  }) {
    const { clusterId, seller, category } = data;
    this.logger.debug(
      {
        message: 'Preparing to mount payload to call partner',
        metadata: {
          correlationId,
          clusterId,
          seller,
          category,
        },
      },
      this.contextService,
    );

    const { orderBy, facets } = filter;
    const { from, to } =
      this.adapterService.mountPaginationToCallPartner(current);

    const mountedOrder = this.adapterService.mountOrder(orderBy);

    const facetsAndFilter = this.adapterService.mountFacetsString({
      facets,
      value: clusterId || seller || category,
      regionId,
      action,
    });

    const operation = `productSearch(
          from: ${from} 
          to: ${to}
          selectedFacets: [${facetsAndFilter}]
          salesChannel: "${this.configService.get('catalogSalesChannel')}"
          hideUnavailableItems: true
          orderBy: "${mountedOrder}"
          )`;

    const query = `@context(provider: "vtex.search-graphql") {
            recordsFiltered
            products{
                productId
                productName
                productClusters {
                    id
                }
                items {
                    images {  imageUrl  }
                    sellers {  
                        sellerDefault 
                        commertialOffer {  Price  ListPrice  Installments {
                          Value
                          NumberOfInstallments
                          PaymentSystemName
                        }
                    }
                    }
                }
            }
            }`;

    this.logger.debug(
      {
        message: 'Payload to call partner mounted successfully',
        metadata: {
          correlationId,
          clusterId,
          seller,
          category,
        },
      },
      this.contextService,
    );

    return {
      dataLogger: {
        correlationId,
        clusterId,
        seller,
        category,
        action: 'get products',
      },
      body: {
        query: `{
          ${operation} ${query}
          }`,
      },
      method: 'POST',
      headers: {
        'x-vtex-api-appKey': this.configService.get('http.vtex.key'),
        'x-vtex-api-appToken': this.configService.get('http.vtex.token'),
      },
      url: this.configService.get('http.vtex.url'),
    };
  }

  public mountPayloadToGetBanners(correlationId: string) {
    return {
      dataLogger: {
        correlationId,
        action: 'get banners',
      },
      body: {},
      headers: {
        'REST-range': 'resources=0-100',
        'content-type': 'application/json',
      },
      url: this.configService.get('http.stampVtex.url'),
      method: 'GET',
    };
  }

  public mountPayloadToGetFilters({
    regionId,
    correlationId,
    data,
    action,
    facets,
  }: {
    correlationId: string;
    regionId: string;
    clusterId: string;
    facets: any;
    data: any;
    action: Action;
  }) {
    const { clusterId, seller, category } = data;

    const facetsAndFilter = this.adapterService.mountFacets({
      facets,
      value: clusterId || seller || category,
      regionId,
      action,
    });

    return {
      dataLogger: {
        correlationId,
        clusterId,
        seller,
        category,
        action: 'get filters',
      },
      body: {
        filters: facetsAndFilter,
      },
      headers: {
        'content-type': 'application/json',
        'region-id': regionId,
        'x-correlation-id': correlationId,
      },
      url: this.configService.get('http.filter.url'),
      method: 'POST',
    };
  }
}
