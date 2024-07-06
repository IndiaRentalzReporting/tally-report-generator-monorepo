import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { UserInsert, DetailedUser, UserSelect } from '../models/schema';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError
} from '../errors';
import { sendMail } from '../mailing';
import UserService from '../services/UserService';
import { createResetPasswordLink, verifyUserJWTToken } from '../utils';

export const handleSignUp = async (
  req: Request<object, object, UserInsert>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await AuthService.signUp(req.body);

    const mailOptions = {
      from: `info@demomailtrap.com`,
      to: user.email,
      subject: 'Node Contact Request',
      html: `<div><p>${user.password}</p></div>`
    };

    sendMail(mailOptions, (error) => {
      if (error) {
        console.error(`Error: ${error}`);
        next(error);
      } else {
        console.log('Mail sent!');
        res.json({ msg: 'email sent' });
      }
    });
  } catch (err) {
    console.error(`Could not sign up the User`);
    return next(err);
  }
};

export const handleSignIn = async (
  req: Request<object, object, UserInsert>,
  res: Response<{
    user: Omit<DetailedUser, 'password'>;
    resetPasswordLink?: string;
  }>,
  next: NextFunction
) => {
  try {
    if (req.isAuthenticated()) {
      const { password, ...user } = req.user;
      let resetPasswordLink;
      if (!req.user.is_confirmed) {
        resetPasswordLink = createResetPasswordLink(req.user);
      }
      return res.json({ user, resetPasswordLink });
    }
    throw new UnauthenticatedError('Not logged in');
  } catch (err) {
    console.error(`Could not sign in the User`);
    return next(err);
  }
};

export const handleLogout = (
  req: Request,
  res: Response<{ message: string }>,
  next: NextFunction
) => {
  req.logOut((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie('connect.sid', { path: '/' }); // 'connect.sid' is the default session cookie name
      return res.json({ message: 'Logged Out' });
    });
  });
};

export const handleStatusCheck = (
  req: Request,
  res: Response<{
    user: Omit<DetailedUser, 'password'> | null;
    isAuthenticated: boolean;
  }>,
  next: NextFunction
) => {
  try {
    if (req.isAuthenticated() && req.user.is_confirmed) {
      const {
        user: { password, ...userWithoutPassword }
      } = req;
      return res.json({
        user: userWithoutPassword,
        isAuthenticated: true
      });
    }
    return res.json({
      user: null,
      isAuthenticated: false
    });
  } catch (e) {
    console.error(`Couldn't check the status`);
    return next(e);
  }
};

export const forgotPassword = async (
  req: Request<
    { token: string },
    object,
    {
      email: UserSelect['email'];
    }
  >,
  res: Response<{ message: string }>,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await UserService.findOne({ email });

    if (!user) {
      throw new NotFoundError('User does not exists');
    }
    const resetLink = createResetPasswordLink(user, true);
    const mailOptions = {
      from: `info@demomailtrap.com`,
      to: user.email,
      subject: 'Password Reset Request',
      text: `Click the following link to reset your password: ${resetLink}`
    };

    return sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Email send error:', error);
        return next(error);
      }
      return res.json({
        message: 'Password reset link sent to your email'
      });
    });
  } catch (error) {
    console.error('Error in forgot-password route:', error);
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
    const id = await verifyUserJWTToken(token);
    res.json({
      token
    });
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
  res: Response<{ message: string }>,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    const userId = await verifyUserJWTToken(token);

    if (password !== confirmPassword) {
      throw new BadRequestError('Password does not match');
    }

    const hashedPassword = await AuthService.hashPassword(password);

    await UserService.updateUser(userId, {
      password: hashedPassword,
      is_confirmed: true
    });

    return res.status(200).json({ message: 'Password has been updated' });
  } catch (error) {
    console.error('Password update error:', error);
    return next(error);
  }
};
