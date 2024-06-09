import { Request, Response } from 'express';
import UserService from '../services/UserService';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await UserService.getAll(req.user?.id ?? '');

  res.json({
    users
  });
};
