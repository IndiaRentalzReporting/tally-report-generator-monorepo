import { BadRequestError, NotFoundError } from '@trg_package/errors';
import { ExtractTablesWithRelations, TableRelationalConfig } from 'drizzle-orm';
import { and, eq } from 'drizzle-orm';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { RelationalQueryBuilder } from 'drizzle-orm/pg-core/query-builders/query';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export class BaseServiceNew<
  H extends Record<string, unknown>,
  T extends PgTableWithColumns<{
    name: string;
    schema: undefined;
    columns: Record<string, any>;
    dialect: 'pg';
  }>
> {
  private entity: string;
  constructor(
    protected dbClient: PostgresJsDatabase<H>,
    protected schema: T,
    protected tableName: RelationalQueryBuilder<
      ExtractTablesWithRelations<H>,
      TableRelationalConfig
    >
  ) {
    //@ts-ignore
    this.entity = this.tableName.tableConfig.dbName;
  }

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
      console.error(`Could not create Database client with URL - ${URL}: ${e}`);
      throw e;
    }
  }

  public async createOne(data: T['$inferInsert']): Promise<T['$inferSelect']> {
    const [entity] = await this.dbClient
      .insert(this.schema)
      .values(data)
      .returning();

    if (!entity)
      throw new BadRequestError(
        `Returned as undefined in ${this.entity}: ${data}`
      );

    return entity;
  }

  public async findMany(
    data: Partial<T['$inferSelect']> = {},
    extra?: Omit<
      NonNullable<
        Parameters<
          RelationalQueryBuilder<
            ExtractTablesWithRelations<H>,
            TableRelationalConfig
          >['findMany']
        >[0]
      >,
      'where'
    >
  ): Promise<T['$inferSelect'][]> {
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
      throw new NotFoundError(`Does not exist in ${this.entity}: ${data}`);
    }

    return entity;
  }

  public async findOne(
    data: Partial<T['$inferSelect']>,
    extra?: Omit<
      NonNullable<
        Parameters<
          RelationalQueryBuilder<
            ExtractTablesWithRelations<H>,
            TableRelationalConfig
          >['findFirst']
        >[0]
      >,
      'where'
    >
  ): Promise<T['$inferSelect']> {
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

    console.log(Object.entries(this.tableName));

    if (!entity) {
      throw new NotFoundError(`Does not exist in ${this.entity}: ${data}`);
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

    if (!entity)
      throw new NotFoundError(`Does not exit in ${this.entity}: ${data}`);

    return entity;
  }

  public async deleteOne(
    id: T['$inferSelect']['id']
  ): Promise<T['$inferSelect']> {
    const [entity] = await this.dbClient
      .delete(this.schema)
      .where(eq(this.schema.id, id))
      .returning();

    if (!entity)
      throw new NotFoundError(`Does not exit in ${this.entity}: ${id}`);

    return entity;
  }
}
