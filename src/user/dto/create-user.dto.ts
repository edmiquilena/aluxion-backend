import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @Length(3, 15)
  @ApiProperty()
  username: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  password: string;
}
