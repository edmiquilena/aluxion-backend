import { Module } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { IntegrationsController } from './integrations.controller';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService],
  imports: [FilesModule],
})
export class IntegrationsModule {}
