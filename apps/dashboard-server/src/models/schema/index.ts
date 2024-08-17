import { DetailedUser } from '@trg_package/dashboard-schemas/schemas';

declare global {
  namespace Express {
    interface User extends DetailedUser {}
  }
}

export * from '@trg_package/dashboard-schemas/schemas';
