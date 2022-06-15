import { Injectable, NotFoundException } from '@nestjs/common';
import { CopyFileDto } from '../files/dto/copy-file.dto';
import { unsplashQueryFileDto } from './dto/unsplash-file.dto';
import { createApi } from 'unsplash-js';
import * as nodeFetch from 'node-fetch';
import { FilesService } from '../files/files.service';
@Injectable()
export class IntegrationsService {
  constructor(private readonly FilesService: FilesService) {}
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

    return this.FilesService.uploadFile({
      dataBuffer,
      userId: copyData.userId,
      filename,
    });
  }

  async searchUnsplash(query: unsplashQueryFileDto) {
    const UnsplashAPI = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_TOKEN,
      fetch: nodeFetch.default as unknown as typeof fetch,
    });
    const unsplashResult = await UnsplashAPI.search.getPhotos(query);
    return unsplashResult.response;
  }
}
