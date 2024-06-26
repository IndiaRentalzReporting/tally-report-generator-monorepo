import * as z from 'zod';
import { errorMessages } from '../../messages/error.messages';

export const User = z.object({
  id: z.string().uuid({ message: errorMessages.invalid('UUID') }),
  first_name: z
    .string()
    .max(50, { message: errorMessages.max('First Name', 50) }),
  last_name: z
    .string()
    .max(50, { message: errorMessages.max('Last Name', 50) }),
  email: z.string().email({ message: errorMessages.invalid('Email') }),
  password: z
    .string()
    .min(5, { message: errorMessages.min('Password', 5) })
    .max(50, { message: errorMessages.max('Street', 50) }),
  created_at: z.date({ message: errorMessages.invalid('Date') }),
  updated_at: z.date({ message: errorMessages.invalid('Date') })
});

export type User = z.infer<typeof User>;

export const RegisterUser = User.pick({
  first_name: true,
  last_name: true,
  email: true,
  password: true
});

export type RegisterUser = z.infer<typeof RegisterUser>;


export const LoginUser = User.pick({
  email: true,
  password: true
});

export type LoginUser = z.infer<typeof LoginUser>;
