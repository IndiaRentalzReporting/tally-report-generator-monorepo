import { UserSelect } from '@fullstack-package/auth-schemas';
declare global {
  namespace Express {
    interface User extends UserSelect {}
  }
}

export * from '@fullstack-package/auth-schemas';
