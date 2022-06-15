import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty()
  @IsString()
  @Length(4, 10)
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;
  
  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;
}
