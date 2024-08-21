import { BadRequestError } from '@trg_package/errors';
import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<void> => {
  const doesPasswordMatch = await bcrypt.compare(password, hash);
  if (!doesPasswordMatch) {
    throw new BadRequestError('Wrong Password');
  }
};
