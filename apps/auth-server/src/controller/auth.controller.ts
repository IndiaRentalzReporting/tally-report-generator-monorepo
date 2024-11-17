import { NextFunction, Request, Response } from 'express';
import {
  LoginUser,
  TenantInsert,
  TenantSelect,
  RegisterUser,
  UserSelect,
} from '@trg_package/schemas-auth/types';
import { BadRequestError, NotFoundError, UnauthenticatedError } from '@trg_package/errors';
import { SafeUserSelect as DashboardSafeUserSelect } from '@trg_package/schemas-dashboard/types';
import bcrypt from 'bcrypt';
import Mail from 'nodemailer/lib/mailer';
import DashboardService from '@/services/DashboardService';
import AuthService from '../services/AuthService';
import config from '@/config';
import { sendMail } from '@/email';
import UserService from '@/services/UserService';

export const onboard = async (
  req: Request<object, object, { tenant: TenantInsert; user: RegisterUser }>,
  res: Response<{ tenant: TenantSelect; user: DashboardSafeUserSelect }>,
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
  req: Request<object, object, LoginUser>,
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
  req: Request<object, object, Omit<RegisterUser, 'password'>>,
  res: Response<{
    user: DashboardSafeUserSelect;
  }>,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new UnauthenticatedError('Not logged in');

    const {
      tenant_id,
      tenant: { db_username, db_password, db_name }
    } = req.user;

    if (!db_username || !db_password || !db_name) {
      throw new BadRequestError('Invalid Tenant');
    }

    const DSI = new DashboardService(db_username, db_password, db_name);
    const tempPassword = await AuthService.generateTempPassword(24);

    const { password, ...user } = await DSI.createUser({
      ...req.body,
      password: tempPassword,
      status: 'inactive'
    });

    await AuthService.signUp({
      ...req.body,
      id: user.id,
      tenant_id,
      status: 'inactive',
      password
    });

    const { MAIL_FROM } = config;

    const mailOptions: Mail.Options = {
      from: `info${MAIL_FROM}`,
      to: user.email,
      subject: 'Node Contact Request',
      html: `<div><p>${tempPassword}</p></div>`,
    };

    return sendMail(mailOptions, (error) => {
      if (error) {
        return next(error);
      }
      return res.json({ user });
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
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      throw new BadRequestError('Password does not match');
    }

    const { id } = await UserService.verifyJwtToken(token);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await UserService.updateOne({ id }, {
      password: hashedPassword,
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
