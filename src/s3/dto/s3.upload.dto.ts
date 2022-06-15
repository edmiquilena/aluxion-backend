import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class S3UploadDto {
  @IsNotEmpty()
  @ApiProperty()
  dataBuffer: Buffer;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  filename: string;
  @IsString()
  @ApiProperty()
  userId: string;
}
