import { NextFunction, Request, Response } from 'express';
import { decrypt } from '../utils/crypto';
import { BadRequestError } from '@trg_package/errors';

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
    const decodedKey = Buffer.from(apiKey, 'base64').toString();
    const decryptedData = decrypt(decodedKey);
    const { tenant } = JSON.parse(decryptedData);

    req.decryptedApiKey = { tenant };
    next();
  } catch (error) {
    throw new BadRequestError('Invalid API key');
  }
};
