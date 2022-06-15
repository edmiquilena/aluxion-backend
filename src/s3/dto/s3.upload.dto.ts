import { IsNotEmpty, IsString } from 'class-validator';
export class S3UploadDto {
  @IsNotEmpty()
  dataBuffer: Buffer;
  @IsString()
  @IsNotEmpty()
  filename: string;
  @IsString()
  userId: string;
}
