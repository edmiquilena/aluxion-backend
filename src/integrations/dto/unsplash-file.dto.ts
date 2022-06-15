import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class unsplashQueryFileDto {
  @IsString()
  @ApiProperty()
  query: string;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  page: number;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  perPage: number;
}
