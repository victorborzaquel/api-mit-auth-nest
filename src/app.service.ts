import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getDatabaseConfig() {
    const host = this.configService.get<string>('http.host');
    const port = this.configService.get<number>('http.port');

    return { host, port };
  }
}
