import { DetailedUser } from '@fullstack-package/dashboard-schemas';

declare global {
  namespace Express {
    interface User extends DetailedUser {}
  }
}

export * from '@fullstack-package/dashboard-schemas';
