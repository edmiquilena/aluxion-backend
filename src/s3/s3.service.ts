import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import S3 from 'aws-sdk/clients/s3';
import { AWSConnection } from 'src/lib/interfaces/general.interfaces';
import { v4 as uuid } from 'uuid';
import { S3UploadDto } from './dto/s3.upload.dto';

@Injectable()
export class S3Service {
  constructor(private configService: ConfigService) {}
// * connect to S3
   async S3() {
 return new S3(this.configService.get<AWSConnection>('aws.connection'))
 }

async uploadFile(data: S3UploadDto) {
    const {dataBuffer, filename} = data;
    const Bucket = this.configService.get<string>('aws.bucket');
    const s3 = await this.S3();

    const result = await s3.upload({
        Bucket,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
        ACL: "public-read",
      })
        .promise();
        return result;
// return {
//     Expiration: 'expiry-date="Fri, 17 Jun 2022 00:00:00 GMT", rule-id="Vencimiento De Archivos"',
//     ETag: '"77f5794e2eb49f7989b8f85e92cfa4e0"',
//     Location: 'https://aluxion-testing.s3.amazonaws.com/a0c9a8b0-f4a0-4fcd-a50c-a882e3144357-blank-profile-picture-g2887d7983_1280.png',
//     key: 'a0c9a8b0-f4a0-4fcd-a50c-a882e3144357-blank-profile-picture-g2887d7983_1280.png',
//     Key: 'a0c9a8b0-f4a0-4fcd-a50c-a882e3144357-blank-profile-picture-g2887d7983_1280.png',
//     Bucket: 'aluxion-testing'
//   };
}


}
