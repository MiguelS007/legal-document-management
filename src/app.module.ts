import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import { Configuration, Helpers } from './common';
import { DocumentModule } from './document/document.module';
import { HealthCheckModule } from './healthcheck/healthcheck.module';
import { MongoModule } from './mongo/mongo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Configuration.envs],
      isGlobal: true,
      cache: true,
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    TerminusModule,
    HealthCheckModule,
    DocumentModule,
    MongoModule,
  ],
  controllers: [],
  providers: [Logger, Helpers],
})
export class AppModule {}
