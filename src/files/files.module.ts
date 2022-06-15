import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { S3Module } from 'src/s3/s3.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from './schema/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'file',
        schema: FileSchema,
      },
    ]),
    S3Module,
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
