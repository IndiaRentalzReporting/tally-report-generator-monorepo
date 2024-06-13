import { NextFunction, Request, Response } from 'express';
import { ActionSelect } from '../models/schema';
import ActionService from '../services/ActionService';

export const getAll = async (
  req: Request,
  res: Response<{ actions: ActionSelect[] }>,
  next: NextFunction
) => {
  try {
    const actions = await ActionService.getAll();
    res.json({ actions });
  } catch (e) {
    console.error('Could not fetch all actions');
    next(e);
  }
};
