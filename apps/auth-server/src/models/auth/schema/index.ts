import { UserSelect } from '@fullstack_package/auth-schemas/schemas';
declare global {
  namespace Express {
    interface User extends UserSelect {}
  }
}

export * from '@fullstack_package/auth-schemas/schemas';
