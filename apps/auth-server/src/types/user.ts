import { UserInsert as DashboardUserInsert, UserSelect as DashboardUserSelect } from '@trg_package/schemas-dashboard/types';
import { UserInsert as AuthUserInsert, UserSelect as AuthUserSelect } from '@trg_package/schemas-auth/types';

export type RegisterUser = Pick<DashboardUserInsert, 'first_name' | 'last_name'>
& Pick<AuthUserInsert, 'email' | 'password'>;

export type UserInsert = AuthUserInsert & DashboardUserInsert;

export type UserSelect = AuthUserSelect & DashboardUserSelect;
