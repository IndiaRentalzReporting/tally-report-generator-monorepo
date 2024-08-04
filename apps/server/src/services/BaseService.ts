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

  public async createOne(data: T['$inferInsert']): Promise<T['$inferSelect']> {
    const [entity] = await db.insert(this.schema).values(data).returning();

    if (!entity)
      throw new NotFoundError(
        `${String(this.schema.name)} returned as undefined`
      );

    return entity;
  }

  public async findAll(): Promise<T['$inferSelect'][]> {
    const entity = await db.select().from(this.schema);

    if (!entity) {
      throw new NotFoundError(`${String(this.schema.name)} does not exist`);
    }

    return entity;
  }

  public async findOne(
    data: Partial<T['$inferSelect']>
  ): Promise<T['$inferSelect']> {
    const keys = Object.keys(data) as Array<
      keyof Partial<typeof this.schema.$inferSelect>
    >;
    const values = Object.values(data) as Array<any>;

    const query = db
      .select()
      .from(this.schema)
      .where(
        and(...keys.map((key, index) => eq(this.schema[key], values[index])))
      )
      .limit(1);

    const entity = await query.execute();

    if (!entity.length) {
      throw new NotFoundError(`${String(this.schema.name)} does not exist`);
    }

    return entity;
  }

  public async updateOne(
    id: T['$inferSelect']['id'],
    data: T['$inferInsert']
  ): Promise<T['$inferSelect']> {
    const [entity] = await db
      .update(this.schema)
      .set({ ...data })
      .where(eq(this.schema.id, id))
      .returning();

    if (!entity)
      throw new NotFoundError(`${String(this.schema.name)} does not exits`);

    return entity;
  }

  public async deleteOneById(
    id: T['$inferSelect']['id']
  ): Promise<T['$inferSelect']> {
    const [entity] = await db
      .delete(this.schema)
      .where(eq(this.schema.id, id))
      .returning();

    if (!entity)
      throw new NotFoundError(`${String(this.schema.name)} does not exits`);

    return entity;
  }
}

export default BaseService;
