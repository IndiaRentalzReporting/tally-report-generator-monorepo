import { and, eq } from 'drizzle-orm';
import { CustomError } from '../errors';
import db from '../models';
import { RoleInsert, RoleSchema, RoleSelect } from '../models/schema';

class RoleService {
  public static async readAll(): Promise<RoleSelect[]> {
    return db.query.RoleSchema.findMany({});
  }

  public static async findOne(data: Partial<RoleSelect>): Promise<RoleSelect> {
    const keys = Object.keys(data) as Array<keyof Partial<RoleSelect>>;
    const values = Object.values(data) as Array<any>;
    const role = await db.query.RoleSchema.findFirst({
      where: and(
        ...keys.map((key, index) => eq(RoleSchema[key], values[index]))
      )
    });

    if (!role) throw new CustomError('Role does not exist', 500);

    return role;
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
      .set({ ...data, name: data.name?.toLowerCase() })
      .where(eq(RoleSchema.id, roleId))
      .returning();

    if (!role) throw new CustomError('Role does not exist', 500);

    return role;
  }
}

export default RoleService;
