import { UserSelect } from '@fullstack_package/auth-schemas';
declare global {
  namespace Express {
    interface User extends UserSelect {}
  }
}

export * from '@fullstack_package/auth-schemas';
