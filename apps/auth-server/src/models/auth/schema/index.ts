import { UserSelect } from '@trg_package/auth-schemas/types';
declare global {
  namespace Express {
    interface User extends UserSelect {}
  }
}

export * from '@trg_package/auth-schemas/schemas';
