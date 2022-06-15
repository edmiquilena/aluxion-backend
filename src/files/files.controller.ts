import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  NotAcceptableException,
  Query,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/auth.jwt.guard';
import { Public } from 'src/lib/public.decorator';
import { ConfigService } from '@nestjs/config';
import { UploadFileDto } from './dto/upload-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Multer } from 'multer';
import { unsplashQueryFileDto } from './dto/unsplash-file.dto';


@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  findAll(@Request() req: any) {
    console.log(req.user);
    return this.filesService.findAll();
  }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@Request() req: any, @UploadedFile() file?: Express.Multer.File) {
if(!file) throw new NotAcceptableException('no valid file');
    return this.filesService.uploadFile({
      dataBuffer: file.buffer,
      filename: file.originalname,
      userId: req.user.userId,
    });
  

  }

  @Post('unsplash')
  uploadUnsplash(@Request() req: any, @Body('id') id: string) {
if(!id) throw new NotAcceptableException('no valid file');
return this.filesService.copyFile({id, userId: req.user.userId})
  

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Public()
  @Get('search/unsplash')
 searchUnsplash(@Query() query: unsplashQueryFileDto) {
   return this.filesService.searchUnsplash(query)
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
