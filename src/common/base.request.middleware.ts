import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Helpers } from './helpers';
import {
  Injectable,
  NestMiddleware,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

import { Configuration } from './configuration.service';
@Injectable()
export class BaseRequestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: any) {
    const envs = Configuration.envs();

    let correlationId = req.headers['x-correlation-id'] as string;

    correlationId = correlationId || uuidv4();

    req.headers['x-correlation-id'] = correlationId;

    next();
  }
}

export const CorrelationId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-correlation-id'];
  },
);

export const InternalDocument = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return Helpers.removeNonNumericCharacters(request.params?.document || '');
  },
);
