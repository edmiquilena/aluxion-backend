import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Readable } from 'stream';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

describe('FilesController', () => {
  let controller: FilesController;
  const req = { user: { userId: '62a806e72f30fc7c7370d154' } }
  const mockFilesService = {
    uploadFile: jest.fn((dto) => {
      return {
        
          Location: 'https://aluxion-testing.s3.amazonaws.com/file.png',
          Key: 'file.png',
          id: '62a95d9d632d42a220259c0c'
      
      };
    }),

    updateFile: jest.fn((userId, id, dto) => {
  
      return {
       key: dto.filename+'.png',
       location: 'https://aluxion-testing.s3.amazonaws.com/file.png',
       creator:  userId
      };
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [FilesService],
    })
      .overrideProvider(FilesService)
      .useValue(mockFilesService)
      .compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller.upload).toBeDefined();
    expect(controller.getFile).toBeDefined();
  });

  it('should upload file to S3 Bucket', () => {
    expect(
      controller.upload(req,
      {
        fieldname: 'file',
        originalname: 'U6nlG0Y5sfs22.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('U6nlG0Y5sfs22.jpg'),
        size: 305023,
        stream: Readable.from(["input string"]), 
        destination: 'file', 
        filename: 'file', 
        path: 'file'
      },
      ),
    )
    .toEqual({   Location: expect.any(String),
    Key: expect.any(String),
    id: expect.any(String) });
  });


  it('should rename file to S3 Bucket', () => {
    const id = new Types.ObjectId();
    expect(
      controller.updateFile(req,  {filename: 'newname'},id)
    )
    .toEqual({    key: expect.any(String),
    location: expect.any(String),
    creator: expect.any(String)});
  });


});
