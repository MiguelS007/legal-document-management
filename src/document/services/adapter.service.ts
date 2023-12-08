import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DateTimeService, Helpers } from '../../common';
import { EFilterBlacklist, EKeyProducts, EProductsOrder } from '../enums';
import { Action } from '../enums/action.enum';
// import {
//   IProductCluster,
//   IProductPartner,
//   IProductStampPartner,
//   IDataGetProductsDto,
//   IFilter,
//   IFacet,
// } from '../interfaces';

@Injectable()
export class AdapterService {
  private readonly contextService = AdapterService.name;
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly dateTimeService: DateTimeService,
    private readonly helpersService: Helpers,
  ) {}

  public mountResponseProductClusters({
    productsAndTotalProducts,
    stamps,
    correlationId,
    orderBy,
    filters,
  }: {
    correlationId: string;
    productsAndTotalProducts: {
      products: Partial<any[]>;
      recordsFiltered: number;
    };
    stamps: any[];
    orderBy: EProductsOrder;
    filters: any[];
  }) {
    this.logger.debug(
      {
        message: 'Start to mount products clusters',
        metadata: {
          correlationId,
        },
      },
      this.contextService,
    );
    const { products, recordsFiltered } = productsAndTotalProducts;

    const productsMounted = this.mountProducts(products, stamps);

    const totalPages = this.mountTotalPages(recordsFiltered);

    this.logger.debug(
      {
        message: 'Products clusters mounted successfully',
        metadata: {
          correlationId,
        },
      },
      this.contextService,
    );

    return {
      recordsFiltered,
      page: {
        total: totalPages,
      },
      filter: {
        orderBy: this.mountOrder(orderBy),
        facets: this.mountFilters(filters),
      },
      products: productsMounted,
    };
  }

  private mountFilters(facets: any[]) {
    const facetsFiltered = facets.filter((facet: any) => {
      const filterBlacklist: string[] = Object.values(EFilterBlacklist);
      if (!filterBlacklist.includes(facet.values[0].key)) {
        return facet;
      }
    });

    return facetsFiltered.map((facet) => {
      return {
        name: facet.name,
        values: facet.values.map((value) => {
          return {
            selected: value.selected,
            name: value.name,
            key: value.key,
            value: value.value,
          };
        }),
      };
    });
  }

  private mountProducts(products: any[], stamps: any[]) {
    return '';
  }

  public mountDataToGetProducts(dataGetCluster: any) {
    const { clusterId, page, filter } = dataGetCluster;
    return {
      clusterId,
      page: page || 1,
      filter: filter || {
        orderBy: EProductsOrder.OrderByScoreDESC,
        facets: null,
      },
    };
  }

  private mountTotalPages(totalProducts: number) {
    return Math.ceil(
      totalProducts / this.configService.get('LIMIT_PRODUCT_CLUSTER_PER_PAGE'),
    );
  }

  private getBannerToProduct({
    productClusters,
    stamps,
  }: {
    productClusters: any[] | string[];
    stamps: any[];
  }) {
    if (!productClusters.length) return null;
    const result = [];

    productClusters.map((productCluster) => {
      const { id } = productCluster;
      stamps.map((stamp) => {
        const { collectionId } = stamp;

        if (collectionId && collectionId.toString() === id) {
          const { imageUrl, createdIn } = stamp;

          const dataStamp = {
            milliseconds:
              this.dateTimeService.convertDateStringInMilliseconds(createdIn),
            imageUrl: imageUrl.replace(' ', '%20'),
          };

          result.push(dataStamp);
        }
      });
    });

    if (result.length) {
      return this.sortBanner(result);
    }

    return null;
  }

  private sortBanner(result: any[]) {
    const sortResult = result.sort(function (a, b) {
      return b.milliseconds - a.milliseconds;
    });

    return {
      images: sortResult.map((imageMounted) => imageMounted.imageUrl),
      milliseconds:
        sortResult.length > 1
          ? this.configService.get('limitImageBanner')
          : null,
    };
  }

  public mountOrder(orderBy: EProductsOrder) {
    return EProductsOrder[orderBy]
      ? EProductsOrder[orderBy]
      : EProductsOrder.OrderByScoreDESC;
  }

  public mountPaginationToCallPartner(current: number) {
    const pageLimit = this.configService.get('LIMIT_PRODUCT_CLUSTER_PER_PAGE');
    const to = current * pageLimit;
    const from = to - pageLimit;

    return {
      to: to - 1,
      from,
    };
  }

  public mountFacetsString({
    action,
    facets,
    regionId,
    value,
  }: {
    facets: any[];
    value: string;
    regionId: string;
    action: Action;
  }) {
    return !facets
      ? `${this.mountValueString(action, value)}
    { key: "region-id", value: "${regionId}"}`
      : `{ key: "region-id", value: "${regionId}"} ${this.getFiltersString(
          facets,
          action,
          value,
        )}`;
  }

  private mountValueString(action: Action, value: string) {
    const values = value.split('/');
    return values.map(
      (valueSplitted) =>
        `{ key: "${EKeyProducts[action]}", value: "${valueSplitted}" }`,
    );
  }

  public mountFacets({
    action,
    facets,
    value,
  }: {
    facets: any[];
    value: string;
    regionId: string;
    action: Action;
  }) {
    return !facets
      ? [...this.mountValues(action, value)]
      : [...this.getFilters(facets, action, value)];
  }

  private mountValues(action: Action, value: string) {
    const values = value.split('/');

    return values.map((valueSplitted) => {
      return { key: EKeyProducts[action], value: valueSplitted };
    });
  }

  private getFiltersString(facets: any[], action: Action, value: string) {
    if (EKeyProducts[action] === EKeyProducts.GET_BY_CLUSTER) {
      facets.push({ key: EKeyProducts.GET_BY_CLUSTER, value });
    }
    return facets.map(
      (filter: any) => `{key: "${filter.key}", value: "${filter.value}"}`,
    );
  }

  private getFilters(facets: any[], action: Action, value: string) {
    if (EKeyProducts[action] === EKeyProducts.GET_BY_CLUSTER) {
      facets.push({ key: EKeyProducts.GET_BY_CLUSTER, value });
    }
    return facets.map((filter: any) => {
      return { key: filter.key, value: filter.value };
    });
  }
}
