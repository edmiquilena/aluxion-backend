import { IsEmail, IsString, Length, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @Length(3, 15)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
