import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '@trg_package/errors';
import { decrypt } from '../utils/crypto';

export const decryptApiKey = (
  req: Request & { decryptedApiKey?: { tenant: string } },
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    throw new BadRequestError('API key is required');
  }

  try {
    const decryptedData = decrypt(apiKey);
    const { tenant } = JSON.parse(decryptedData);

    req.decryptedApiKey = { tenant };
    next();
  } catch (error) {
    throw new BadRequestError('Invalid API key');
  }
};
