import { IsNotEmpty, IsString } from 'class-validator';
export class S3CopyDto {
  @IsString()
  @IsNotEmpty()
  newKey: string;
  @IsString()
  @IsNotEmpty()
  oldKey: string;
}
