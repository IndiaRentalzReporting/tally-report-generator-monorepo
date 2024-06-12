import { eq } from 'drizzle-orm';
import { ActionInsert, ActionSchema, ActionSelect } from '../models/schema';
import db from '../models';
import { CustomError } from '../errors';

class ActionService {
  public static async findOne(
    actionName: ActionInsert['name']
  ): Promise<ActionSelect> {
    const action = await db.query.ActionSchema.findFirst({
      where: eq(ActionSchema.name, actionName)
    });

    if (!action) {
      throw new CustomError('Database error: Action does not exist', 500);
    }
    return action;
  }

  public static async createOne(data: ActionInsert): Promise<ActionSelect> {
    const [action] = await db.insert(ActionSchema).values(data).returning();

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
