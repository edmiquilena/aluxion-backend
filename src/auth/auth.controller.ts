import { Controller, Post, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/lib/public.decorator';
import { ResetUserDto } from 'src/user/dto/reset-user.dto';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { RequestResetAuthDto } from './dto/reset-request-auth.dto';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login to your account' })
  @ApiOkResponse({description: 'JSON of JWT token and user details'})
  @ApiBadRequestResponse({description: 'wrong identifier/password'})
  loginUser(@Body() userObject: LoginAuthDto) {
    return this.authService.login(userObject);
  }
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new account' })
  registerUser(@Body() userObject: RegisterAuthDto) {
    return this.authService.register(userObject);
  }
  @Public()
  @Post('request-reset')
  @ApiOperation({ summary: 'Request password reset' })
  requestPasswordReset(@Body() userObject: RequestResetAuthDto) {
    return this.authService.requestPasswordReset(userObject);
  }
  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'complete password reset' })
  resetPassword(@Body() resetObject: ResetUserDto) {
    return this.authService.resetPassword(resetObject);
  }

  @Public()
  @Post('validate-token')
  @ApiOperation({ summary: 'Validate if reset token is real (useful for frontend)' })
  validResetToken(@Body('token', new ParseUUIDPipe()) token: string) {
    return this.authService.validResetToken(token);
  }
}
