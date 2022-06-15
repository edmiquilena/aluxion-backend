import {
  Controller,
  Post,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/lib/public.decorator';
import { ResetUserDto } from 'src/user/dto/reset-user.dto';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { RequestResetAuthDto } from './dto/reset-request-auth.dto';

@ApiTags('auth')
@Controller({path:'auth',
version: '1'})
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  loginUser(@Body() userObject: LoginAuthDto) {
    return this.authService.login(userObject);
  }
  @Public()
  @Post('register')
  registerUser(@Body() userObject: RegisterAuthDto) {
    return this.authService.register(userObject);
  }
  @Public()
  @Post('request-reset')
  requestPasswordReset(@Body() userObject: RequestResetAuthDto) {
    return this.authService.requestPasswordReset(userObject);
  }
  @Public()
  @Post('reset-password')
  resetPassword(@Body() resetObject: ResetUserDto) {
    return this.authService.resetPassword(resetObject);
  }

  @Public()
  @Post('validate-token')
  validResetToken(@Body('token', new ParseUUIDPipe()) token: string) {
    return this.authService.validResetToken(token);
  }



}
