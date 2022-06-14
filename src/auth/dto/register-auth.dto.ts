import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  @Length(4, 10)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
