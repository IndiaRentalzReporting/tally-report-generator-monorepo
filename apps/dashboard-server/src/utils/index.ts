import { NotFoundError } from '@trg_package/errors';
import { UserSelect } from '@trg_package/dashboard-schemas/types';
import config from '../config';
import jwt from 'jsonwebtoken';
import { UserService } from '@trg_package/dashboard-schemas/services';

export const generateUserJWTToken = (user: UserSelect): string => {
  const { SMTP_SECRET } = config;
  const token = jwt.sign({ id: user.id }, SMTP_SECRET, { expiresIn: '15m' });
  return token;
};

export const verifyUserJWTToken = async (
  token: string,
  UserService: UserService
): Promise<UserSelect['id']> => {
  interface IToken extends jwt.JwtPayload {
    id: string;
  }
  const { SMTP_SECRET } = config;
  const { id } = jwt.verify(token, SMTP_SECRET) as IToken;
  const user = await UserService.findOne({ id });
  return user.id;
};

export const createResetPasswordLink = (
  user: UserSelect,
  isEmail: boolean = false
): string => {
  const { PROTOCOL, DASH_SUBDOMAIN, DOMAIN, TLD } = config;
  const FRONTEND_URL = `${PROTOCOL}://${DASH_SUBDOMAIN}.${DOMAIN}.${TLD}`;
  const token = generateUserJWTToken(user);
  const resetLink = `${isEmail ? FRONTEND_URL : ''}/reset-password/${token}`;
  return resetLink;
};
