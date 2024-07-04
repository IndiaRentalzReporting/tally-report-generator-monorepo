import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthService from '../services/AuthService';
import { UserInsert, DetailedUser, UserSelect } from '../models/schema';
import { CustomError, NotFoundError, UnauthenticatedError } from '../errors';
import config from '../config';
import { sendMail } from '../mailing';
import UserService from '../services/UserService';

interface IToken extends jwt.JwtPayload {
  id: string;
}

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

    sendMail(mailOptions, (error, info) => {
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

    const { SMTP_SECRET } = config.emailing;
    jwt.sign(
      { id: user.id },
      SMTP_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          throw new CustomError(err.message, 500);
        }
        const resetLink = `https://yourfrontend.com/reset-password/${token}`;
        const mailOptions = {
          from: `info@demomailtrap.com`,
          to: user.email,
          subject: 'Password Reset Request',
          text: `Click the following link to reset your password: ${resetLink}`
        };

        return sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Email send error:', error);
            return next(error);
          }
          return res.json({
            message: 'Password reset link sent to your email'
          });
        });
      }
    );
  } catch (error) {
    console.error('Error in forgot-password route:', error);
    return next(error);
  }
};

export const resetPassword = async (
  req: Request<
    { token: string },
    object,
    {
      password: UserSelect['password'];
      confirm_password: UserSelect['password'];
    }
  >,
  res: Response<{ message: string }>,
  next: NextFunction
) => {
  const { token } = req.params;
  const { password, confirm_password } = req.body;
  const { SMTP_SECRET } = config.emailing;

  try {
    const { id } = jwt.verify(token, SMTP_SECRET) as IToken;

    try {
      const hashedPassword = await AuthService.hashPassword(password);

      await UserService.updateUser(id, { password: hashedPassword });

      return res.status(200).json({ message: 'Password has been updated' });
    } catch (error) {
      console.error('Password update error:', error);
      return next(error);
    }
  } catch (error) {
    console.error('Token verification error:', error);
  }
};

export const handleSignIn = async (
  req: Request<object, object, UserInsert>,
  res: Response<{ user: Omit<DetailedUser, 'password'> }>,
  next: NextFunction
) => {
  try {
    if (req.isAuthenticated()) {
      const { password, ...user } = req.user;
      return res.json({ user });
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
    if (req.isAuthenticated()) {
      const {
        user: { password, ...userWithoutPassword }
      } = req;
      console.log({ userWithoutPassword });
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
