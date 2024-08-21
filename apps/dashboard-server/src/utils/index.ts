import { NotFoundError } from '@trg_package/errors';
import { UserSelect } from '@trg_package/dashboard-schemas/types';
import config from '../config';
import jwt from 'jsonwebtoken';
import UserService from '../services/UserService';

export const generateUserJWTToken = (user: UserSelect): string => {
  const { SMTP_SECRET } = config;
  const token = jwt.sign({ id: user.id }, SMTP_SECRET, { expiresIn: '15m' });
  return token;
};

export const verifyUserJWTToken = async (
  token: string
): Promise<UserSelect['id']> => {
  interface IToken extends jwt.JwtPayload {
    id: string;
  }
  const { SMTP_SECRET } = config;
  const { id } = jwt.verify(token, SMTP_SECRET) as IToken;
  const user = await UserService.findOne({ id });
  if (!user) {
    throw new NotFoundError('User does not exist!');
  }
  return user.id;
};

export const createResetPasswordLink = (
  user: UserSelect,
  isEmail: boolean = false
): string => {
  const FRONTEND_URL = 'http://dashboard.trg.local';
  const token = generateUserJWTToken(user);
  const resetLink = `${isEmail ? FRONTEND_URL : ''}/reset-password/${token}`;
  return resetLink;
};
