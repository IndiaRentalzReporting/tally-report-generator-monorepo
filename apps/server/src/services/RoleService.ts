import { eq } from 'drizzle-orm';
import { CustomError } from '../errors';
import db from '../models';
import { RoleInsert, RoleSchema, RoleSelect } from '../models/schema';

class RoleService {
  public static async readAll(): Promise<RoleSelect[]> {
    return db.query.RoleSchema.findMany({});
  }

  public static async createOne(data: RoleInsert): Promise<RoleSelect> {
    const [role] = await db
      .insert(RoleSchema)
      .values({ ...data, name: data.name.toLowerCase() })
      .returning();

    if (!role) {
      throw new CustomError('Database error: Role returned as undefined', 500);
    }

    return role;
  }

  public static async updateOne(
    roleId: RoleSelect['id'],
    data: Partial<RoleSelect>
  ): Promise<RoleSelect> {
    const [role] = await db
      .update(RoleSchema)
      .set(data)
      .where(eq(RoleSchema.id, roleId))
      .returning();

    if (!role) throw new CustomError('Role does not exist', 500);

    return role;
  }
}

export default RoleService;
