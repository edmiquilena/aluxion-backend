import { IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @MinLength(4)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}
