import { DetailedUser as AuthDetailedUser } from '@trg_package/schemas-auth/types';
import { DetailedUser as DashDetailedUser } from '@trg_package/schemas-dashboard/types';

export interface DetailedUser extends AuthDetailedUser, DashDetailedUser {}
