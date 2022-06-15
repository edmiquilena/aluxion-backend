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
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Public } from '../lib/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from './pipes/ParseObjectId.pipe';
@ApiBearerAuth()
@ApiTags('files')
@Controller({path:'files',
version: '1'})
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all uploaded files by logged user' })

  findAll(@Request() req: any) {
    return this.filesService.findAll(req.user.userId);
  }
  @Post('upload')
  @ApiOperation({ summary: 'Upload new file to bucket and server' })
  @UseInterceptors(FileInterceptor('file')) 
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  upload(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadFile({
      dataBuffer: file.buffer,
      filename: file.originalname,
      userId: req.user.userId,
    });
  }
  @Public()
  @Get(':id/download')
  @ApiOperation({ summary: 'Download file by ID' })

  @ApiParam({
    name: 'id',
    type: 'string'
   })
  @Redirect('', 302)
  downloadFile(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.filesService.downloadHandler(id);
  }

  @Public()
  @ApiParam({
   name: 'id',
   type: 'string'
  })
  @ApiOperation({ summary: 'Find uploaded file by ID' })

  @Get(':id')
  getFile(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.filesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rename uploaded file in bucket' })

  @ApiParam({
    name: 'id',
    type: 'string'
   })
   @ApiBody({
    schema: {
      type: 'object',
      properties: {
        filename: {
          type: 'string',
        },
      },
    },
  })
  updateFile(
    @Request() req: any,
    @Body() updateFileDto: UpdateFileDto,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ) {
    return this.filesService.updateFile(req.user.userId, id, updateFileDto);
  }
}
