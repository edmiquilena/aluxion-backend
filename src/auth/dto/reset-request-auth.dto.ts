import { IsString, MinLength } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { LoginAuthDto } from './login-auth.dto';

export class RequestResetAuthDto extends OmitType(LoginAuthDto, [
  'password',
] as const) {}
