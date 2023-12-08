import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import { WinstonModule } from 'nest-winston';
import compression from 'compression';
import winston from 'winston';

import { AppModule } from './app.module';
import { Configuration, BaseRequestMiddleware } from './common';

async function bootstrap() {
  const envs = Configuration.envs();
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: envs.loggingLevel,
      transports: new winston.transports.Console(),
    }),
  });

  console.log('env >>>', envs.enviromment);
  if (envs.enviromment === 'Development') {
    const config = new DocumentBuilder()
      .setTitle('Legal Document Management Api')
      .setDescription('Document Management APIs')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    console.log('document', document);
    const { writeFile } = await import('fs/promises');
    await writeFile('./swagger-spec.json', JSON.stringify(document));
    await writeFile('./openapi-run.yaml', yaml.dump(document));
    SwaggerModule.setup('/swagger', app, document);
  }
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(compression());
  app.use(new BaseRequestMiddleware().use);
  await app.listen(envs.port);
}

bootstrap();
