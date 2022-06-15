import { PartialType } from '@nestjs/mapped-types';
import { S3UploadDto } from 'src/s3/dto/s3.upload.dto';

export class UploadFileDto extends PartialType(S3UploadDto) {}
