import { BadRequestError } from '@trg_package/errors';
import bcrypt from 'bcrypt';
import {
  UserInsert
} from '@trg_package/schemas-auth/types';
import { Request } from 'express';
import UserService from './user.service';

class AuthService {
  public static async signIn(
    data: Pick<UserInsert, 'email' | 'password'>
  ): Promise<Request['user']> {
    const { email, password } = data;
    const user = await UserService.findOne({
      email
    });

    const doesPasswordMatch = await bcrypt.compare(password, user.password);
    if (!doesPasswordMatch) {
      throw new BadRequestError('Wrong Password');
    }

    return user;
  }
}

export default AuthService;
