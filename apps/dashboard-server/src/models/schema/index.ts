import { DetailedUser } from '@fullstack_package/dashboard-schemas';

declare global {
  namespace Express {
    interface User extends DetailedUser {}
  }
}

export * from '@fullstack_package/dashboard-schemas';
