import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  username: string;
  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;
}
