import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(@InjectModel('user') private userModule: Model<UserDocument>) {}

  async getUser(handle: string) {
    // handle may be either username or email
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
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      userObject = { ...userObject, password: hashedPassword };

      const newUser = new this.userModule({ ...userObject });
      await newUser.save();
      return newUser;
    } catch (e) {
      // code 11000 equals duplicate
      if (e.code === 11000) {
        throw new NotAcceptableException(
          'Username/password is already registered!',
        );
      }
      throw new NotAcceptableException('Something went wrong!');
    }
  }
}
