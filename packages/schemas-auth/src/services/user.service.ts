import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import bcrypt from 'bcrypt';
import { UserSchema } from '@/schemas';
import * as authSchemas from '@/schemas';
import {
  DetailedUser, TenantSelect, UserInsert, UserSelect
} from '@/types';

export class UserService extends BaseServiceNew<
  typeof authSchemas,
  typeof UserSchema
> {
  constructor(db: PostgresJsDatabase<typeof authSchemas>) {
    super(db, UserSchema, db.query.UserSchema);
  }

  public async findOneWithTenant(
    data: Partial<UserSelect>,
    tenant_id?: TenantSelect['id']
  ): Promise<DetailedUser> {
    const user = await super.findOne(data,{
      with: {
        userTenants: {
          with: {
            tenant: true
          }
        }
      }
    }) as Omit<DetailedUser, 'tenant'>;
    const currentTenant = user.userTenants.find(({
      tenant
    }) => tenant.id === tenant_id)?.tenant || user.userTenants[0]?.tenant;
    if (!currentTenant) throw new Error('Tenant not found!');
    return {
      ...user,
      tenant: currentTenant
    };
  }

  public async createOne(data: UserInsert): Promise<UserSelect> {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(data.password, salt);
    const user = await super.createOne({
      ...data,
      password
    });
    return user;
  }

  public async updateOne(
    filterData: Partial<UserSelect>,
    data: Partial<UserInsert>
  ): Promise<UserSelect> {
    const update = data;
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(data.password, salt);
      update.password = password;
    }
    const user = await super.updateOne(filterData, data);
    return user;
  }
}
