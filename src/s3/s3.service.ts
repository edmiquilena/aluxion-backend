import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import S3 from 'aws-sdk/clients/s3';
import { AWSConnection } from '../lib/interfaces/general.interfaces';
import { v4 as uuid } from 'uuid';
import { S3CopyDto } from './dto/s3.copy.dto';
import { S3UploadDto } from './dto/s3.upload.dto';

@Injectable()
export class S3Service {
  constructor(private configService: ConfigService) {}
  // * connect to S3
  async S3() {
    return new S3(this.configService.get<AWSConnection>('aws.connection'));
  }

  async uploadFile(data: S3UploadDto) {
    const { dataBuffer, filename } = data;
    const Bucket = this.configService.get<string>('aws.bucket');
    const s3 = await this.S3();

    const result = await s3
      .upload({
        Bucket,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
        ACL: 'public-read',
      })
      .promise();
    return result;
  }

  async CopyFile(fileData: S3CopyDto) {
    const { newKey, oldKey } = fileData;
    const s3 = await this.S3();
    const Bucket = this.configService.get<string>('aws.bucket');

    const copyResult = await s3
      .copyObject({
        Bucket,
        CopySource: `${Bucket}/${oldKey}`,
        Key: newKey,
        ACL: 'public-read',
      })
      .promise();

    if (copyResult) {
      // ! Got no permission to delete, so both files will live in bucket.
      //     const deleteOld = await this.deleteFile(oldKey);
      //     console.log(deleteOld)
      //    if(deleteOld) {
      return copyResult;
      //    }
    }
  }

  async deleteFile(oldKey: string) {
    const s3 = await this.S3();
    const Bucket = this.configService.get<string>('aws.bucket');

    return await s3
      .deleteObject({
        Bucket: Bucket,
        Key: oldKey,
      })
      .promise();
  }
}
