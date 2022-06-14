import { Injectable } from '@nestjs/common';
interface simpleVersioning {
  version: number;
}
@Injectable()
export class AppService {
  getVersion(): simpleVersioning {
    return { version: 1 };
  }
}
