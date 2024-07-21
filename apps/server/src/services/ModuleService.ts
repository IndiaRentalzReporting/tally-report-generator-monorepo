import { and, eq } from 'drizzle-orm';
import { ModuleColumnsValue } from '@fullstack_package/interfaces';
import { CustomError, NotFoundError } from '../errors';
import db from '../models';
import {
  ModuleInsert,
  ModuleSchema,
  ModuleSelect
} from '../models/schema/modules';
import PermissionService from './PermissionService';
import { modifySvgDimensions } from '../utils';
import DatabaseService from './DatabaseService';

class ModuleService {
  public static async createOne(
    data: ModuleInsert,
    columnDetails: Array<{
      name: ModuleInsert['name'];
      type: ModuleColumnsValue;
    }>
  ): Promise<ModuleSelect | null> {
    const [module] = await db
      .insert(ModuleSchema)
      .values({
        ...data,
        name: data.name.toUpperCase(),
        icon: data.icon ? modifySvgDimensions(data.icon, 20, 20) : null
      })
      .returning();

    if (!module) {
      throw new CustomError(
        'Database error: Module returned as undefined',
        500
      );
    }

    try {
      await DatabaseService.createNewTable(module.name, columnDetails);
    } catch (e) {
      await this.deleteOne(module.id);
      throw e;
    }

    await PermissionService.extendSuperuserModules(module.id);

    return null;
  }

  public static async findOne(
    data: Partial<ModuleSelect>
  ): Promise<{ module: ModuleSelect; columns?: Object }> {
    const keys = Object.keys(data) as Array<keyof Partial<ModuleSelect>>;
    const values = Object.values(data) as Array<any>;
    const module = await db.query.ModuleSchema.findFirst({
      where: and(
        ...keys.map((key, index) => eq(ModuleSchema[key], values[index]))
      )
    });

    if (!module) {
      throw new NotFoundError(`Module does not exist`);
    }

    const columns = await DatabaseService.findColumns(module.name);
    console.log({ columns });

    return { module, columns };
  }

  public static async readAll(): Promise<ModuleSelect[]> {
    return db.query.ModuleSchema.findMany({});
  }

  public static async updateOne(
    data: ModuleInsert,
    id: ModuleSelect['id']
  ): Promise<ModuleSelect> {
    const [module] = await db
      .update(ModuleSchema)
      .set({
        ...data,
        name: data.name.toUpperCase(),
        icon: data.icon ? modifySvgDimensions(data.icon, 20, 20) : null
      })
      .where(eq(ModuleSchema.id, id))
      .returning();

    if (!module) {
      throw new NotFoundError('Module does not exist');
    }

    return module;
  }

  public static async deleteOne(id: ModuleSelect['id']): Promise<ModuleSelect> {
    const [module] = await db
      .delete(ModuleSchema)
      .where(eq(ModuleSchema.id, id))
      .returning();

    if (!module) {
      throw new NotFoundError('Module does not exist');
    }

    await DatabaseService.dropTable(module.name);

    return module;
  }
}

export default ModuleService;
