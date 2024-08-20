import { NotFoundError } from '@trg_package/errors';
import { comparePassword } from '@trg_package/utils';
import { UserInsert, UserSelect } from '@trg_package/auth-schemas/types';
import UserService from './UserService';
import { DetailedUser } from '@trg_package/dashboard-schemas/types';

class AuthService {
  public static async signIn(
    data: Pick<UserInsert, 'email' | 'password'>
  ): Promise<UserSelect & DetailedUser> {
    const { email, password } = data;
    const user = await UserService.findOne({
      email
    });

    if (!user) {
      throw new NotFoundError('User does not exist');
    }

    await comparePassword(password, user.password);

    return user;
  }
}

export default AuthService;
