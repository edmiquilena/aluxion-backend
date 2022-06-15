import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength } from 'class-validator';
export class ResetUserDto {
  @ApiProperty()
    @IsUUID(4)
  token: string;
  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;
}
