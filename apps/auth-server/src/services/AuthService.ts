import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import {
  BadRequestError,
  NotFoundError
} from '@fullstack_package/core-application/errors';
import { SafeUserSelect, UserInsert, UserSelect } from '../models/auth/schema';
import UserService from './UserService';

class AuthService {
  public static async signUp(data: UserInsert): Promise<SafeUserSelect> {
    try {
      await UserService.findOne({
        email: data.email
      });
      throw new BadRequestError('User Already Exists');
    } catch (e) {
      if (e instanceof NotFoundError) {
        const { password, ...user } = await UserService.createOne({
          ...data,
          password: await this.hashPassword(data.password)
        });

        return user;
      }
      throw e;
    }
  }

  public static async signIn(
    data: Pick<UserInsert, 'email' | 'password'>
  ): Promise<UserSelect> {
    const { email, password } = data;
    const user = await UserService.findOne({
      email
    });

    if (!user) {
      throw new NotFoundError('User does not exist');
    }

    await this.comparePassword(password, user.password);

    return user;
  }

  public static async changePassword(
    data: Pick<UserInsert, 'email'> & {
      password: string;
    }
  ): Promise<Omit<UserSelect, 'password'>> {
    const { email, password: pw } = data;
    const { password, ...user } = await UserService.updateOne(email, {
      password: pw
    });

    if (user === undefined) {
      throw new NotFoundError('User does not exist');
    }

    return user;
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  }

  static async comparePassword(password: string, hash: string): Promise<void> {
    const doesPasswordMatch = await bcrypt.compare(password, hash);
    if (!doesPasswordMatch) {
      throw new BadRequestError('Wrong Password');
    }
  }

  static async generateTempPassword(length: number): Promise<string> {
    return randomBytes(length).toString('hex').slice(0, length);
  }
}

export default AuthService;
