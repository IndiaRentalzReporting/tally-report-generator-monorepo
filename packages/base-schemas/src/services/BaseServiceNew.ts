import { and, eq } from 'drizzle-orm';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export class BaseServiceNew<
  T extends PgTableWithColumns<{
    name: string;
    schema: undefined;
    columns: Record<string, any>;
    dialect: 'pg';
  }>
> {
  constructor(
    protected dbClient: PostgresJsDatabase<Record<string, unknown>>,
    protected schema: T
  ) {}

  public static createClient<T extends Record<string, unknown>>(
    URL: string,
    schema: T,
    options: {
      DB_MIGRATING: boolean;
      DB_SEEDING: boolean;
    }
  ): { client: PostgresJsDatabase<T>; connection: postgres.Sql } {
    try {
      const connection = postgres(URL, {
        max: options.DB_MIGRATING || options.DB_SEEDING ? 1 : undefined
      });
      const client = drizzle(connection, {
        schema,
        logger: true
      });
      return {
        client,
        connection
      };
    } catch (e) {
      console.error(`Could not create Database client: ${e}`);
      throw e;
    }
  }

  public async createOne(data: T['$inferInsert']): Promise<T['$inferSelect']> {
    const [entity] = await this.dbClient
      .insert(this.schema)
      .values(data)
      .returning();

    if (!entity)
      throw new Error(`${this.schema._?.name} returned as undefined`);

    return entity;
  }

  public async findMany(
    data: Partial<T['$inferSelect']> = {}
  ): Promise<T['$inferSelect'][]> {
    const keys = Object.keys(data) as Array<
      keyof Partial<typeof this.schema.$inferSelect>
    >;
    const values = Object.values(data) as Array<any>;
    const entity = await this.dbClient
      .select()
      .from(this.schema)
      .where(
        and(...keys.map((key, index) => eq(this.schema[key], values[index])))
      );

    if (!entity.length) {
      throw new Error(`${this.schema._?.name} does not exist`);
    }

    return entity;
  }

  public async findOne(
    data: Partial<T['$inferSelect']> = {}
  ): Promise<T['$inferSelect']> {
    const keys = Object.keys(data) as Array<
      keyof Partial<typeof this.schema.$inferSelect>
    >;
    const values = Object.values(data) as Array<any>;
    const [entity] = await this.dbClient
      .select()
      .from(this.schema)
      .where(
        and(...keys.map((key, index) => eq(this.schema[key], values[index])))
      )
      .limit(1);

    if (!entity) {
      throw new Error(`${this.schema._?.name} does not exist`);
    }

    return entity;
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

    if (!entity) throw new Error(`${this.schema._?.name} does not exits`);

    return entity;
  }

  public async deleteOne(
    id: T['$inferSelect']['id']
  ): Promise<T['$inferSelect']> {
    const [entity] = await this.dbClient
      .delete(this.schema)
      .where(eq(this.schema.id, id))
      .returning();

    if (!entity) throw new Error(`${this.schema._?.name} does not exits`);

    return entity;
  }
}
