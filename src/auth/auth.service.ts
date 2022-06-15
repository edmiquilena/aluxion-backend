import { Injectable, NotAcceptableException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RequestResetAuthDto } from './dto/reset-request-auth.dto';
import { ResetUserDto } from 'src/user/dto/reset-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { RecoveryPath } from 'src/lib/interfaces/general.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private configService: ConfigService
  ) {}
  async register(userObject: RegisterAuthDto) {
    return this.userService.newUser(userObject);
  }

  async login(userObject: LoginAuthDto) {
    const { password, username } = userObject;

    const findUser = await this.userService.getUser(username);
    if (!findUser)
      throw new NotAcceptableException('username/password mismatch');

    const verifyPassowrd = await bcrypt.compare(password, findUser.password);
    if (!verifyPassowrd)
      throw new NotAcceptableException('username/password mismatch');

    const payload = {
      username: findUser.username,
      email: findUser.email,
      sub: findUser._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  async requestPasswordReset(userObject: RequestResetAuthDto) {
    try {
      const resetDetails = await this.userService.newPasswordRequest(
        userObject.username,
      );
      const { email, recovery_token } = resetDetails;
      const appPaths = this.configService.get<RecoveryPath>('appPaths');
      const appName = this.configService.get<string>('appName');
      const from = `${appName} Support <${this.configService.get<string>('defaultEmail')}>`

      const mail = await this.mailerService.sendMail({
        to: email,
        from,
        subject: 'Forgot your password? We got you! - ' + appName,
        template: 'recover',
        context: {
          link: `${appPaths.root}${appPaths.recovery}/${recovery_token}`,
        },
      });
      if (mail.accepted.length > 0) return { mailSent: true, email: email };
      throw new NotAcceptableException(
        'Something went wrong! Try again later.',
      );
    } catch (err) {
      if (err.response) throw new NotAcceptableException(err.response.message);
      throw new NotAcceptableException('Something went wrong!');
    }
  }

  async resetPassword(resetObject: ResetUserDto) {
    return this.userService.resetPassword(resetObject);
  }

  async validResetToken(token: string) {
    return this.userService.validResetToken(token);
  }
}
