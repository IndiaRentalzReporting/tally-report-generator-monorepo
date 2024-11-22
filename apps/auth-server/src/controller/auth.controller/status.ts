import { NextFunction, Request, Response } from 'express';

export const handleStatusCheck = async (
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
