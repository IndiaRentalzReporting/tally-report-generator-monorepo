import { JSDOM } from 'jsdom';
import jwt from 'jsonwebtoken';
import { UserSelect } from '../models/schema';
import config from '../config';
import UserService from '../services/UserService';
import { NotFoundError } from '../errors';

export const modifySvgDimensions = (
  svgStr: string,
  newWidth: number,
  newHeight: number
): string => {
  const dom = new JSDOM(svgStr, { contentType: 'image/svg+xml' });
  const { document } = dom.window;

  const svgElement = document.querySelector('svg');
  if (!svgElement) {
    throw new Error('No SVG element found');
  }

  svgElement.setAttribute('width', String(newWidth));
  svgElement.setAttribute('height', String(newHeight));

  return dom.serialize();
};

export const toTitleCase = (str: string): string => {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
};

export const generateUserJWTToken = (user: UserSelect): string => {
  const { SMTP_SECRET } = config.emailing;
  const token = jwt.sign({ id: user.id }, SMTP_SECRET, { expiresIn: '15m' });
  return token;
};

export const verifyUserJWTToken = async (
  token: string
): Promise<UserSelect['id']> => {
  interface IToken extends jwt.JwtPayload {
    id: string;
  }
  const { SMTP_SECRET } = config.emailing;
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
  const { FRONTEND_URL } = config.server;
  const token = generateUserJWTToken(user);
  const resetLink = `${isEmail ? FRONTEND_URL : ''}/reset-password/${token}`;
  return resetLink;
};
