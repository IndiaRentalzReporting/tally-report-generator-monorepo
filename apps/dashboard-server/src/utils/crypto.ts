import crypto from 'crypto';
import config from '../config';

const { ENCRYPTION_KEY } = config;

export const encrypt = (data: Record<string, any>): string => {
  const text = JSON.stringify(data);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    'aes-128-gcm',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );

  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag().toString('base64');
  return `${iv.toString('base64')}:${authTag}:${encrypted}`;
};

export const decrypt = <T extends Record<string, any>>(text: string): T => {
  const textParts = text.split(':');
  const textPart1 = textParts[0];
  const textPart2 = textParts[1];
  const encryptedText = textParts[2];

  if (!encryptedText || !textPart1 || !textPart2) {
    throw new Error('Encrypted text is required');
  }

  const iv = Buffer.from(textPart1, 'base64');
  const authTag = Buffer.from(textPart2, 'base64');

  const decipher = crypto.createDecipheriv(
    'aes-128-gcm',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
};
