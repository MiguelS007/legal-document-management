import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Helpers {
  constructor(private readonly configService: ConfigService) {}

  public static removeNonNumericCharacters(value: string) {
    return value.replace(/\D/g, '');
  }
}
