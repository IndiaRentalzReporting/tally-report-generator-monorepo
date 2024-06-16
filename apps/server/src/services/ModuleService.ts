import { CustomError } from '../errors';
import db from '../models';
import {
  ModuleInsert,
  ModuleSchema,
  ModuleSelect
} from '../models/schema/modules';

class ModuleService {
  public static async createOne(data: ModuleInsert): Promise<ModuleSelect> {
    const [module] = await db
      .insert(ModuleSchema)
      .values({ ...data, name: data.name.toUpperCase() })
      .returning();

    if (!module) {
      throw new CustomError(
        'Database error: Module returned as undefined',
        500
      );
    }

    return module;
  }

  public static async getAll(): Promise<ModuleSelect[]> {
    return db.query.ModuleSchema.findMany({});
  }
}

export default ModuleService;
