import { NotFoundError, BadRequestError } from '@trg_package/errors';
import { UserSelect } from '@trg_package/schemas-auth/types';
import { NextFunction, Request, Response } from 'express';
import UserService from '../../services/user.service';
import { sendMail } from '../../email';
import config from '../../config';

export const forgotPassword = async (
  req: Request<{ token: string }, object, { email: UserSelect['email'] }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await UserService.findOne({ email });

    if (!user) {
      throw new NotFoundError('User does not exist');
    }

    const {
      PROTOCOL,
      AUTH_SUBDOMAIN,
      DOMAIN,
      TLD,
      MAIL_FROM
    } = config;

    const FRONTEND_URL = `${PROTOCOL}://${AUTH_SUBDOMAIN}.${DOMAIN}.${TLD}`;
    const token = await UserService.createJwtToken({ user_id: user.id });
    const resetLink = `${FRONTEND_URL}/password/reset/${token}`;

    const mailOptions = {
      from: `info${MAIL_FROM}`,
      to: user.email,
      subject: 'Password Reset Request',
      text: `Click the following link to reset your password: ${resetLink}`
    };

    return sendMail(mailOptions, async (error) => {
      if (error) {
        return next(error);
      }
      return res.status(200).send();
    });
  } catch (error) {
    return next(error);
  }
};

export const checkPasswordResetToken = async (
  req: Request<{ token: string }>,
  res: Response<{ token: string | null }>,
  next: NextFunction
) => {
  const { token } = req.params;

  try {
    await UserService.verifyJwtToken(token);
    res.status(200).send();
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request<
  object,
  object,
  {
    password: UserSelect['password'];
    confirmPassword: UserSelect['password'];
  },
  { token: string }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      throw new BadRequestError('Password does not match');
    }

    const { token } = req.query;
    const { user_id, tenant_id } = await UserService.verifyJwtToken(token);

    if (!tenant_id) {
      throw new BadRequestError('Invalid reset password token');
    }

    await UserService.updateOneWithTenant({ id: user_id }, {
      password,
      status: 'active'
    }, tenant_id);

    return res.status(200).send();
  } catch (error) {
    return next(error);
  }
};
