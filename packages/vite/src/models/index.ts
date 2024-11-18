import { DetailedUser as AuthDetailedUser, UserSelect as AuthUserSelect } from '@trg_package/schemas-auth/types';
import { DetailedUser as DashDetailedUser, UserSelect as DashboardUserSelect } from '@trg_package/schemas-dashboard/types';

export interface DetailedUser extends AuthDetailedUser, DashDetailedUser {}

export interface LoginUser extends Pick<AuthUserSelect, 'email' | 'password'> {}

export interface RegisterUser extends LoginUser, Pick<DashboardUserSelect, 'first_name' | 'last_name'> {}
