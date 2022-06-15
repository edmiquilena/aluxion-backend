import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseInterceptors,
  UploadedFile,
  NotAcceptableException,
  Redirect,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/lib/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from './pipes/ParseObjectId.pipe';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  findAll(@Request() req: any) {
    console.log(req.user);
    return this.filesService.findAll(req.user.userId);
  }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@Request() req: any, @UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new NotAcceptableException('no valid file');
    return this.filesService.uploadFile({
      dataBuffer: file.buffer,
      filename: file.originalname,
      userId: req.user.userId,
    });
  }
  @Public()
  @Get(':id/download')
  @Redirect('', 302)
  downloadFile(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.filesService.downloadHandler(id);
  }

  @Public()
  @Get(':id')
  getFile(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.filesService.findOne(id);
  }

  @Patch(':id')
  updateFile(
    @Request() req: any,
    @Body() updateFileDto: UpdateFileDto,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ) {
    console.log(updateFileDto);
    return this.filesService.updateFile(req.user.userId, id, updateFileDto);
  }
}
