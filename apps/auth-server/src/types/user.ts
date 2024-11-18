import { UserInsert as DashboardUserInsert } from '@trg_package/schemas-dashboard/types';
import { UserInsert as AuthUserInsert } from '@trg_package/schemas-auth/types';

export type RegisterUser = Pick<DashboardUserInsert, 'first_name' | 'last_name'> & Pick<AuthUserInsert, 'email' | 'password'>;
