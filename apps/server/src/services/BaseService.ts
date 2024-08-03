import { and, eq } from 'drizzle-orm';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { NotFoundError } from '../errors';
import db from '../models';

class BaseService<
  T extends PgTableWithColumns<{
    name: string;
    schema: undefined;
    columns: Record<string, any>;
    dialect: 'pg';
  }>
> {
  constructor(protected schema: T) {}

  public async findOne(
    data: Partial<T['$inferSelect']>
  ): Promise<T['$inferSelect']> {
    const keys = Object.keys(data) as Array<
      keyof Partial<typeof this.schema.$inferSelect>
    >;
    const values = Object.values(data) as Array<any>;

    const module = await db
      .select()
      .from(this.schema)
      .where(
        and(...keys.map((key, index) => eq(this.schema[key], values[index])))
      )
      .limit(1);

    if (!module) {
      throw new NotFoundError(`Module does not exist`);
    }

    return module;
  }
}

export default BaseService;
