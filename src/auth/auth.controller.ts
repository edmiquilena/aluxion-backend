import {
  Controller,
  Get, 
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginUser(@Body() userObject: LoginAuthDto) {
   return this.authService.login(userObject)
  }

  @Post('register')
  registerUser(@Body() userObject: RegisterAuthDto) {
    console.log({ ...userObject });
    return this.authService.register(userObject);
  }
}
