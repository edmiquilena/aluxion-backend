import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  NotAcceptableException,
  Query,
} from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { unsplashQueryFileDto } from './dto/unsplash-file.dto';
import { Public } from '../lib/public.decorator';
@ApiTags('integrations')
@Controller({
  path: 'integrations',
  version: '1',
})

export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post('unsplash')
  uploadUnsplash(@Request() req: any, @Body('id') id: string) {
    if (!id) throw new NotAcceptableException('no valid file');
    return this.integrationsService.copyFile({ id, userId: req.user.userId });
  }
  @Public()
  @Get('unsplash')
  searchUnsplash(@Query() query: unsplashQueryFileDto) {
    return this.integrationsService.searchUnsplash(query);
  }
}
