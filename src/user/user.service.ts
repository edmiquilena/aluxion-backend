import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from './schema/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { ResetUserDto } from './dto/reset-user.dto';
import hashPassword from 'src/lib/password.hash';

@Injectable()
export class UserService {
  constructor(@InjectModel('user') private userModule: Model<UserDocument>) {}

  async getUser(handle: string) {
    // ? handle may be either username or email
    const user = await this.userModule
      .findOne({
        $or: [{ username: handle }, { email: handle }],
      })
      .collation({ locale: 'en', strength: 2 });
    return user;
  }

  async newUser(userObject: CreateUserDto) {
    try {
      const { password } = userObject;

      const hashedPassword = await hashPassword(password);
      userObject = { ...userObject, password: hashedPassword };

      const newUser = new this.userModule({ ...userObject });
      await newUser.save();
      return {success: true, user: {username:newUser.username, email: newUser.email}};
    } catch (e) {
      // * code 11000 equals duplicate
      if (e.code === 11000) {
        throw new NotAcceptableException(
          'Username/password is already registered!',
        );
      }
      throw new NotAcceptableException('Something went wrong!');
    }
  }

  async newPasswordRequest(username: string) {
    const findUser = await this.getUser(username);
    if (!findUser) throw new NotFoundException('username/email not found');
    const recovery_token = uuidv4();
    const recovery_expire = DateTime.utc().plus({ hours: 8 });
    findUser.resetPasswordToken = recovery_token;
    findUser.resetPasswordExpires = recovery_expire;
    await findUser.save();
    return {
      ExpiresAt: recovery_expire,
      email: findUser.email,
      recovery_token,
    };
  }

  // ? validResetToken - useful for frontend validation to show if user should be prompt to change password or not
  async validResetToken(token: string) {
    const user = await this.userModule
      .findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: DateTime.utc() },
      })
      .collation({ locale: 'en', strength: 2 });
    if (!user) throw new NotFoundException('Token provided is not valid');
    return { isValid: !!user, email: user.email };
  }

  async resetPassword(resetObject: ResetUserDto) {
    const { token, password } = resetObject;
    const user = await this.userModule
      .findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: DateTime.utc() },
      })
      .collation({ locale: 'en', strength: 2 });
    if (!user)
      throw new UnauthorizedException('Token provided is not valid or expired');
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    try {
      await user.save();
      return {success: true, email: user.email}
    } catch (e) {
      throw new NotAcceptableException('Something went wrong!');
    }
  }
}
