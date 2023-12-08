import { HttpModule } from '@nestjs/axios';
import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DocumentController } from './controllers/v1';
import {
  AdapterService,
  DocumentService,
  AdapterTriggerService,
} from './services';
import { DateTimeService, Helpers, TriggerService } from '../common';
import { PayloadValidator } from '../validators';
import { DocumentRepository } from './repositories';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('http.timeout'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DocumentController],
  providers: [
    DocumentService,
    DocumentRepository,
    AdapterService,
    AdapterTriggerService,
    TriggerService,
    ConfigService,
    PayloadValidator,
    Helpers,
    DateTimeService,
    Logger,
  ],
})
export class DocumentModule {}
