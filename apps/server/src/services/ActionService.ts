import { and, eq } from 'drizzle-orm';
import { ActionInsert, ActionSchema, ActionSelect } from '../models/schema';
import db from '../models';
import { CustomError } from '../errors';

class ActionService {
  public static async getAll(): Promise<ActionSelect[]> {
    return db.query.ActionSchema.findMany();
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
      throw new CustomError('Database error: Action does not exist', 500);
    }
    return action;
  }

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

    return action;
  }
}

export default ActionService;
