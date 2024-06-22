import { and, eq } from 'drizzle-orm';
import { ActionInsert, ActionSchema, ActionSelect } from '../models/schema';
import db from '../models';
import { CustomError, NotFoundError } from '../errors';
import PermissionService from './PermissionService';

class ActionService {
  public static async createOne(data: ActionInsert): Promise<ActionSelect> {
    const [action] = await db
      .insert(ActionSchema)
      .values({
        ...data,
        name: data.name.toUpperCase() as ActionInsert['name']
      })
      .returning();

    if (!action) {
      throw new CustomError(
        'Database error: Action returned as undefined',
        500
      );
    }

    await PermissionService.extendSuperuserActions(action.id);

    return action;
  }

  public static async findOne(
    data: Partial<ActionSelect>
  ): Promise<ActionSelect> {
    const keys = Object.keys(data) as Array<keyof Partial<ActionSelect>>;
    const values = Object.values(data) as Array<any>;

    const action = await db.query.ActionSchema.findFirst({
      where: and(
        ...keys.map((key, index) => eq(ActionSchema[key], values[index]))
      )
    });

    if (!action) {
      throw new NotFoundError('Action does not exist');
    }
    return action;
  }

  public static async readAll(): Promise<ActionSelect[]> {
    return db.query.ActionSchema.findMany();
  }

  public static async updateOne(
    data: Partial<ActionInsert>,
    id: ActionSelect['id']
  ): Promise<ActionSelect> {
    const [action] = await db
      .update(ActionSchema)
      .set({ ...data, name: data.name?.toUpperCase() })
      .where(eq(ActionSchema.id, id))
      .returning();

    if (!action) throw new NotFoundError('Action does not exits');

    return action;
  }

  public static async deleteOne(id: ActionSelect['id']): Promise<ActionSelect> {
    const [action] = await db
      .delete(ActionSchema)
      .where(eq(ActionSchema.id, id))
      .returning();

    if (!action) throw new NotFoundError('Action does not exits');

    return action;
  }
}

export default ActionService;
