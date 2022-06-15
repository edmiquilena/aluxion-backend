import { isURL } from 'class-validator';
import ValidatorJS  from 'validator';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import S3 from 'aws-sdk/clients/s3';
import { AWSConnection } from 'src/lib/interfaces/general.interfaces';
import { S3Service } from 'src/s3/s3.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { S3UploadDto } from 'src/s3/dto/s3.upload.dto';
import { FileDocument } from './schema/file.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CopyFileDto } from './dto/copy-file.dto';
import { unsplashQueryFileDto } from './dto/unsplash-file.dto';
import { createApi } from 'unsplash-js';
import * as nodeFetch from 'node-fetch'


@Injectable()
export class FilesService {
  constructor( private configService: ConfigService,
    private readonly S3Service: S3Service,
    @InjectModel('file') private fileModule: Model<FileDocument>) {}

  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }
  async uploadFile(uploadData: S3UploadDto) {
    console.log(uploadData)
    const {userId} = uploadData;
    console.log(userId)
const fileUpload = await this.S3Service.uploadFile(uploadData);
const {Location, Key} = fileUpload;
const createEntry = new this.fileModule({creator: userId, location: Location, key: Key})
createEntry.save();

return {
  Location, Key, id: createEntry._id
}

}


async copyFile(copyData: CopyFileDto) {
console.log(copyData)
if(!ValidatorJS.isURL(copyData.url)) throw new NotAcceptableException('Not a valid URL.');
}


  async searchUnsplash(query: unsplashQueryFileDto) {
   
    const UnsplashAPI = createApi({
      accessKey: 'phUvXxIs4jO6WH_eVmkwA-hmtSAzFLnCORzdry6m1CY',
      fetch: nodeFetch.default as unknown as typeof fetch,
    });
    const unsplashResult = await UnsplashAPI.search.getPhotos(query);
    return unsplashResult.response;
  }

  async findAll() {

    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
