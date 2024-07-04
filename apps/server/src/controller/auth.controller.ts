import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthService from '../services/AuthService';
import { UserInsert, DetailedUser, UserSelect } from '../models/schema';
import { UnauthenticatedError } from '../errors';
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
    const { SMTP_SECRET } = config.emailing;
    jwt.sign(
      {
        id: user.id
      },
      SMTP_SECRET,
      { expiresIn: '1d' },
      (err, idToken) => {
        const mailOptions = {
          from: `info@demomailtrap.com`,
          to: user.email,
          subject: 'Node Contact Request',
          html: `<div>https://localhost:4000/auth/create-password/${idToken} <p>${user.password}</p></div>`
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
  } catch (err) {
    console.error(`Could not sign up the User`);
    return next(err);
  }
};

export const createNewPassword = async (
  req: Request<
    { token: string },
    object,
    Pick<UserInsert, 'password'> & { confirm_password: string }
  >,
  res: Response<{ msg: string; user: Omit<UserSelect, 'password'> }>,
  next: NextFunction
) => {
  try {
    const { SMTP_SECRET } = config.emailing;
    const { id } = jwt.verify(req.params.token, SMTP_SECRET) as IToken;
    const password = await AuthService.hashPassword(req.body.password);
    const user = await UserService.updateUser(id, {
      password
    });
    return res.json({ msg: 'password changed succesfully', user });
  } catch (err) {
    next(err);
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
