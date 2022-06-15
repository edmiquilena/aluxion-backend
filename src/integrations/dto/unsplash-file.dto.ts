import { IsNumber, IsOptional, IsString } from 'class-validator';

export class unsplashQueryFileDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsNumber()
  page: number;

  @IsNumber()
  @IsOptional()
  perPage: number;
}
