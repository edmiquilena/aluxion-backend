import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsUrl, isURL, ValidateIf } from "class-validator";

export class CopyFileDto {

@IsString()
userId: string;

  @ApiProperty()
@IsString()
id: string;


}
