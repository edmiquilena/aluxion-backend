import {IsString, IsUrl, isURL, ValidateIf } from "class-validator";

export class CopyFileDto {

@IsString()
userId: string;


@IsString()
url: string;


}
