import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthService from '../services/AuthService';
import { UserInsert, UserSelect, DetailedUser } from '../models/schema';
import { UnauthenticatedError } from '../errors';
import config from '../config';
import { sendMail } from '../mailing';

export const handleSignUp = async (
  req: Request<object, object, UserInsert>,
  res: Response,
  next: NextFunction
) => {
  try {
    await AuthService.signUp(req.body);
    next();
  } catch (err) {
    console.error(`Could not sign up the User`);
    return next(err);
  }
};

export const sendEmailConfirmation = (
  req: Request<object, object, UserInsert>,
  res: Response<{ msg: string }>,
  next: NextFunction
) => {
  const { SMTP_SECRET } = config.emailing;
  jwt.sign(
    {
      user: req.body.id
    },
    SMTP_SECRET,
    { expiresIn: '1d' },
    (err, emailToken) => {
      const mailOptions = {
        from: `info@demomailtrap.com`,
        to: req.body.email,
        subject: 'Node Contact Request',
        text: `https://localhost:4000/auth/confirmation/${emailToken}`
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
    }
  );
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
