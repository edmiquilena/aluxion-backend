import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { Types } from 'mongoose';
import path from 'path';

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

  async downloadHandler(id: Types.ObjectId) {
    const file = await this.findOne(id);
    if (!file) new NotFoundException('File does not exist');
    return { url: file.location };
  }

  async findAll(userId: Types.ObjectId) {
    const data = await this.fileModule.find({ creator: userId });
    return { data };
  }

  async findOne(id: Types.ObjectId) {
    const file = await this.fileModule.findById(id);
    if (!file) return file;
    const fileObject = file.toObject();
    fileObject.name = path.basename(file.key, path.extname(file.key));
    return fileObject;
  }

  async updateFile(
    userId: Types.ObjectId,
    id: Types.ObjectId,
    updateFileDto: UpdateFileDto,
  ) {
    const file = await this.findOne(id);
    if (!file) return new NotFoundException('File does not exist');

    if (file.creator != userId)
      return new ForbiddenException('Access forbidden');
    const newKey = `${updateFileDto.filename}${path.extname(file.key)}`;
    const oldKey = file.key;
    const newLocation = file.location.replace(oldKey, newKey);
    const copyFile = await this.S3Service.CopyFile({ newKey, oldKey });
    if(!copyFile) new NotFoundException('Something went wrong!');
   return await this.fileModule.findByIdAndUpdate(id, {key: newKey, location: newLocation}, {new: true})

    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
