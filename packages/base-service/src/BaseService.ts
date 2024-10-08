import { NotFoundError } from '@trg_package/errors';
import { and, eq, TableRelationalConfig } from 'drizzle-orm';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { RelationalQueryBuilder } from 'drizzle-orm/pg-core/query-builders/query';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class BaseService<
  H extends Record<string, unknown>,
  T extends PgTableWithColumns<{
    name: string;
    schema: undefined;
    columns: Record<string, any>;
    dialect: 'pg';
  }>,
  K extends RelationalQueryBuilder<T, TableRelationalConfig>
> {
  private entity: string;

  constructor(
    protected dbClient: PostgresJsDatabase<H>,
    protected schema: T,
    protected tableName: K
  ) {
    // @ts-ignore
    this.entity = this.tableName.tableConfig.dbName;
  }

  public async createOne(data: T['$inferInsert']): Promise<T['$inferSelect']> {
    const [entity] = await this.dbClient
      .insert(this.schema)
      .values(data)
      .returning();

    if (!entity) throw new NotFoundError(`${this.entity} returned as undefined`);

    return entity;
  }

  public async findMany(
    data: Partial<T['$inferSelect']> = {},
    extra?: Omit<NonNullable<Parameters<K['findMany']>[0]>, 'where'>
  ): Promise<NonNullable<Awaited<ReturnType<K['findMany']>>>> {
    const keys = Object.keys(data) as Array<
    keyof Partial<typeof this.schema.$inferSelect>
    >;
    const values = Object.values(data) as Array<any>;
    const entity = await this.tableName.findMany({
      where: and(
        ...keys.map((key, index) => eq(this.schema[key], values[index]))
      ),
      ...extra
    });

    if (!entity.length) {
      throw new NotFoundError(`${this.entity} does not exist`);
    }

    return entity as NonNullable<Awaited<ReturnType<K['findMany']>>>;
  }

  public async findOne(
    data: Partial<T['$inferSelect']>,
    extra?: Omit<NonNullable<Parameters<K['findFirst']>[0]>, 'where'>
  ): Promise<NonNullable<Awaited<ReturnType<K['findFirst']>>>> {
    const keys = Object.keys(data) as Array<
    keyof Partial<typeof this.schema.$inferSelect>
    >;
    const values = Object.values(data) as Array<any>;

    const entity = await this.tableName.findFirst({
      where: and(
        ...keys.map((key, index) => eq(this.schema[key], values[index]))
      ),
      ...extra
    });

    if (!entity) {
      throw new NotFoundError(`${this.entity} does not exist`);
    }

    return entity as NonNullable<Awaited<ReturnType<K['findFirst']>>>;
  }

  public async updateOne(
    id: T['$inferSelect']['id'],
    data: Partial<T['$inferInsert']>
  ): Promise<T['$inferSelect']> {
    const [entity] = await this.dbClient
      .update(this.schema)
      .set({ ...data })
      .where(eq(this.schema.id, id))
      .returning();

    if (!entity) throw new NotFoundError(`${this.entity} does not exits`);

    return entity;
  }

  public async deleteOneById(
    id: T['$inferSelect']['id']
  ): Promise<T['$inferSelect']> {
    const [entity] = await this.dbClient
      .delete(this.schema)
      .where(eq(this.schema.id, id))
      .returning();

    if (!entity) throw new NotFoundError(`${this.entity} does not exits`);

    return entity;
  }
}
