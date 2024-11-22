import { UnauthenticatedError } from '@trg_package/errors';
import { UserSelect as AuthUserSelect } from '@trg_package/schemas-auth/types';
import { UserSelect as DashboardUserSelect } from '@trg_package/schemas-dashboard/types';
import { NextFunction, Request, Response } from 'express';
import Mail from 'nodemailer/lib/mailer';
import config from '@/config';
import { RegisterUser } from '@/types/user';
import AuthService from '@/services/auth.service';
import UserService from '@/services/user.service';
import { sendMail } from '@/email';

export const handleSignIn = async (
  req: Request<object, object, Pick<RegisterUser, 'email' | 'password'>>,
  res: Response<{
    user: Request['user'],
    firstLoginResetToken?: string
  }>,
  next: NextFunction
) => {
  try {
    if (req.isAuthenticated()) {
      const { user } = req;
      let token;
      if (user.status === 'inactive') {
        token = await UserService.createJwtToken({ user_id: user.id });
      }
      return res.json({
        user,
        firstLoginResetToken: token,
      });
    }
    throw new UnauthenticatedError('Not logged in');
  } catch (err) {
    return next(err);
  }
};

export const handleSignUp = async (
  req: Request<object, object, Omit<RegisterUser, 'password'> & { role_id?: DashboardUserSelect['role_id'] }>,
  res: Response<{
    user: AuthUserSelect;
  }>,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new UnauthenticatedError('Not logged in');

    const {
      tenant
    } = req.user;

    const tempPassword = await AuthService.generateTempPassword(24);
    const dashboardUser = await AuthService.signUp(tenant, {
      ...req.body,
      password: tempPassword
    });

    const { MAIL_FROM } = config;

    const mailOptions: Mail.Options = {
      from: `info${MAIL_FROM}`,
      to: req.body.email,
      subject: 'Node Contact Request',
      html: `<div><p>${tempPassword}</p></div>`,
    };

    return sendMail(mailOptions, (error) => {
      if (error) {
        return next(error);
      }
      return res.json({ user: dashboardUser });
    });
  } catch (err) {
    return next(err);
  }
};

export const handleSignOut = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.logOut((err) => {
    if (err) return next(err);
    return res
      .clearCookie('connect.sid', { path: '/' })
      .status(200)
      .send();
  });
};
