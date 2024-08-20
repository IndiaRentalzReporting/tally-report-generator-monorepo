import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { BadRequestError, NotFoundError } from '@trg_package/errors';
import {
  UserInsert,
  UserSelect,
  SafeUserSelect
} from '@trg_package/auth-schemas/types';
import UserService from './AuthUserService';
import { comparePassword } from '@trg_package/utils';

class AuthService {
  public static async signUp(data: UserInsert): Promise<SafeUserSelect> {
    const doesUserAlreadyExists = await UserService.findOne({
      email: data.email
    });

    if (doesUserAlreadyExists != null) {
      throw new BadRequestError('User Already Exists');
    }

    const { password, ...user } = await UserService.createOne(data);
    return user;
  }

  public static async signIn(
    data: Pick<UserInsert, 'email' | 'password'>
  ): Promise<UserSelect> {
    const { email, password } = data;
    const user = await UserService.findOne({
      email
    });

    if (user === undefined) {
      throw new NotFoundError('User does not exist');
    }

    await comparePassword(password, user.password);

    return user;
  }

  public static async changePassword(
    data: Pick<UserInsert, 'email'> & {
      password: string;
    }
  ): Promise<SafeUserSelect> {
    const { email, password: pw } = data;
    const { password, ...user } = await UserService.updateOne(email, {
      password: pw
    });

    if (user === undefined) {
      throw new NotFoundError('User does not exist');
    }

    return user;
  }

  static async generateTempPassword(length: number): Promise<string> {
    return randomBytes(length).toString('hex').slice(0, length);
  }
}

export default AuthService;
