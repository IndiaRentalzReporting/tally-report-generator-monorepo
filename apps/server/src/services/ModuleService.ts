import { and, eq } from 'drizzle-orm';
import { CustomError } from '../errors';
import db from '../models';
import {
  ModuleInsert,
  ModuleSchema,
  ModuleSelect
} from '../models/schema/modules';
import PermissionService from './PermissionService';

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

    await PermissionService.extendSuperuserModules(module.id);

    return module;
  }

  public static async readAll(): Promise<ModuleSelect[]> {
    return db.query.ModuleSchema.findMany({});
  }

  public static async findOne(
    data: Partial<ModuleSelect>
  ): Promise<ModuleSelect> {
    const keys = Object.keys(data) as Array<keyof Partial<ModuleSelect>>;
    const values = Object.values(data) as Array<any>;
    const module = await db.query.ModuleSchema.findFirst({
      where: and(
        ...keys.map((key, index) => eq(ModuleSchema[key], values[index]))
      )
    });

    if (!module) {
      throw new CustomError(`Module does not exist`, 500);
    }

    return module;
  }
}

export default ModuleService;
