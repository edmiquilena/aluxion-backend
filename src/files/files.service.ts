import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { S3Service } from 'src/s3/s3.service';
import { S3UploadDto } from 'src/s3/dto/s3.upload.dto';
import { FileDocument } from './schema/file.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CopyFileDto } from './dto/copy-file.dto';
import { unsplashQueryFileDto } from './dto/unsplash-file.dto';
import { createApi } from 'unsplash-js';
import * as nodeFetch from 'node-fetch';

@Injectable()
export class FilesService {
  constructor(
    private configService: ConfigService,
    private readonly S3Service: S3Service,
    @InjectModel('file') private fileModule: Model<FileDocument>,
  ) {}


  async uploadFile(uploadData: S3UploadDto) {
    console.log(uploadData);
    const { userId } = uploadData;
    console.log(userId);
    const fileUpload = await this.S3Service.uploadFile(uploadData);
    const { Location, Key } = fileUpload;
    const createEntry = new this.fileModule({
      creator: userId,
      location: Location,
      key: Key,
    });
    createEntry.save();

    return {
      Location,
      Key,
      id: createEntry._id,
    };
  }

  async copyFile(copyData: CopyFileDto) {
    const UnsplashAPI = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_TOKEN,
      fetch: nodeFetch.default as unknown as typeof fetch,
    });
    const getUnsplashImage = await UnsplashAPI.photos.get({
      photoId: copyData.id,
    });
    if (!getUnsplashImage.response)
      throw new NotFoundException('ID does not match any photo in unsplash');
    const getImage = await nodeFetch.default(
      getUnsplashImage.response.urls.regular,
    );

    const dataBuffer = Buffer.from(await getImage.arrayBuffer());
    // * Unsplash specifies that images uploaded on their service are converted to JPEG format.
    const filename = `unsplash-${copyData.id}.jpg`;

    return this.uploadFile({ dataBuffer, userId: copyData.userId, filename });
  }

  async searchUnsplash(query: unsplashQueryFileDto) {
    const UnsplashAPI = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_TOKEN,
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
