import { PickType } from '@nestjs/mapped-types';
import { S3UploadDto } from 'src/s3/dto/s3.upload.dto';

export class UpdateFileDto extends PickType(S3UploadDto, [
  'filename',
] as const) {}
