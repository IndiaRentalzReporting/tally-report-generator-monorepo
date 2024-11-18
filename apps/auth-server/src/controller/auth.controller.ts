import { NextFunction, Request, Response } from 'express';
import {
  TenantInsert,
  TenantSelect,
  UserSelect,
} from '@trg_package/schemas-auth/types';
import { BadRequestError, NotFoundError, UnauthenticatedError } from '@trg_package/errors';
import { UserSelect as DashboardUserSelect } from '@trg_package/schemas-dashboard/types';
import Mail from 'nodemailer/lib/mailer';
import AuthService from '../services/AuthService';
import config from '@/config';
import { sendMail } from '@/email';
import UserService from '@/services/user.service';
import { RegisterUser } from '@/types/user';

export const onboard = async (
  req: Request<object, object, { tenant: TenantInsert; user: RegisterUser }>,
  res: Response<{ tenant: TenantSelect; user: UserSelect }>,
  next: NextFunction
) => {
  try {
    const { user, tenant } = await AuthService.onboard(req.body);
    res.json({ user, tenant });
  } catch (err) {
    return next(err);
  }
};

export const handleSignIn = async (
  req: Request<object, object, Pick<RegisterUser, 'email' | 'password'>>,
  res: Response<{
    user: Request['user'],
    redirect?: string
  }>,
  next: NextFunction
) => {
  try {
    if (req.isAuthenticated()) {
      const { user } = req;
      let token;
      if (user.status === 'inactive') {
        token = await UserService.createJwtToken(user.id);
      }
      return res.json({
        user,
        redirect: token ? `/reset-password/${token}` : undefined
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
    user: UserSelect;
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
    return req.session.destroy((err) => {
      if (err) return next(err);
      return res
        .clearCookie('connect.sid', { path: '/' })
        .status(200)
        .send();
    });
  });
};

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
    const token = await UserService.createJwtToken(user.id);
    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;

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
  { token: string },
    object,
  {
    password: UserSelect['password'];
    confirmPassword: UserSelect['password'];
  }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      throw new BadRequestError('Password does not match');
    }

    const { token } = req.params;
    const { id } = await UserService.verifyJwtToken(token);

    await UserService.updateOne({ id }, {
      password,
      status: 'active'
    });

    return res.status(200).send();
  } catch (error) {
    return next(error);
  }
};

export const handlePublicStatusCheck = async (
  req: Request,
  res: Response<{
    user: Request['user'] | null;
    isAuthenticated: boolean;
  }>,
  next: NextFunction
) => {
  try {
    if (req.isAuthenticated()) {
      const { user } = req;

      return res.json({
        user,
        isAuthenticated: true,
      });
    }
    return req.logOut((err) => {
      if (err) return next(err);
      return req.session.destroy((err) => {
        if (err) return next(err);
        return res
          .clearCookie('connect.sid', { path: '/' })
          .json({
            user: null,
            isAuthenticated: false
          });
      });
    });
  } catch (e) {
    return next(e);
  }
};

export const handlePrivateStatusCheck = (
  req: Request,
  res: Response<{
    user: Request['user'] | null;
    isAuthenticated: boolean;
  }>,
  next: NextFunction
) => {
  try {
    if (req.isAuthenticated()) {
      const { user } = req;
      return res.originalJson({
        user,
        isAuthenticated: true
      });
    }
    return res
      .clearCookie('connect.sid', { path: '/' })
      .clearCookie('permissions', { path: '/' })
      .json({
        user: null,
        isAuthenticated: false
      });
  } catch (e) {
    return next(e);
  }
};
