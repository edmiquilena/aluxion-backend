import { IsString, IsUUID, MinLength } from 'class-validator';
export class ResetUserDto {
    @IsUUID(4)
  token: string;

  @IsString()
  @MinLength(8)
  password: string;
}
