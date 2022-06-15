import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { simpleVersioning } from './lib/interfaces/general.interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('version')
  getVersion(): simpleVersioning {
    return this.appService.getVersion();
  }
}
