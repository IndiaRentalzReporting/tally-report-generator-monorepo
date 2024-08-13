import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import {
  BadRequestError,
  NotFoundError
} from '@fullstack_package/core-application/errors';
import { UserInsert, UserSelect, DetailedUser } from '../models/schema';
import UserService from './UserService';

class AuthService {
  public static async signUp(
    data: UserInsert
  ): Promise<Omit<UserSelect, 'password'>> {
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
  ): Promise<DetailedUser> {
    const { email, password } = data;
    const user = (await UserService.findOneDetailedUser({
      email
    })) as DetailedUser;

    if (user === undefined) {
      throw new NotFoundError('User does not exist');
    }

    const passwordMatch = await this.comparePassword(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestError('Wrong Password');
    }

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

  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  }

  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    const doesPasswordMatch = await bcrypt.compare(password, hash);
    return doesPasswordMatch;
  }

  static async generateTempPassword(length: number): Promise<string> {
    return randomBytes(length).toString('hex').slice(0, length);
  }
}

export default AuthService;
