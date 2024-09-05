import { DetailedUser as AuthDetailedUser } from '@trg_package/auth-schemas/types';
import { DetailedUser as DashDetailedUser } from '@trg_package/dashboard-schemas/types';

declare global {
  namespace Express {
    interface User extends AuthDetailedUser, DashDetailedUser {}
  }
}
