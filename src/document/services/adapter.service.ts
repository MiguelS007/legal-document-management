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

  public mount({
  }: {

  }
}
