import { Injectable, NotAcceptableException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
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
      ...payload,
    };
  }
}
