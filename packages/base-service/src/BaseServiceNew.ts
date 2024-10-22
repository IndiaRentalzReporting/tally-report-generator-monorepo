import {
  CreateError,
  DeleteError,
  ReadError,
  UpdateError
} from '@trg_package/errors';
import {
  ExtractTablesWithRelations, TableRelationalConfig , and, eq
} from 'drizzle-orm';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { RelationalQueryBuilder } from 'drizzle-orm/pg-core/query-builders/query';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

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
    // @ts-ignore
    this.entity = this.tableName.tableConfig.dbName;
  }

  public async createOne(data: T['$inferInsert']): Promise<T['$inferSelect']> {
    try {
      const [entity] = await this.dbClient
        .insert(this.schema)
        .values(data)
        .returning();

      if (!entity) throw new CreateError(this.entity, data);

      return entity;
    } catch (e) {
      console.error(e);
      throw new CreateError(this.entity, data);
    }
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
    try {
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
        throw new ReadError(this.entity, data);
      }

      return entity;
    } catch (error) {
      console.error(error);
      throw new ReadError(this.entity, data);
    }
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
    try {
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
        throw new ReadError(this.entity, data);
      }

      return entity;
    } catch (error) {
      console.error(error);
      throw new ReadError(this.entity, data);
    }
  }

  public async updateOne(
    filterData: Partial<T['$inferSelect']>,
    data: Partial<T['$inferInsert']>
  ): Promise<T['$inferSelect']> {
    try {
      const keys = Object.keys(filterData) as Array<
      keyof Partial<typeof this.schema.$inferSelect>
      >;
      const values = Object.values(filterData) as Array<any>;

      if(Object.prototype.hasOwnProperty.call(this.schema,"isReadonly"))
      {
        keys.push("isReadOnly");
        values.push(false);
      }

      const [entity] = await this.dbClient
        .update(this.schema)
        .set({ ...data })
        .where(
          and(
            ...keys.map((key, index) => eq(this.schema[key], values[index]))
          )
        )
        .returning();

      if (!entity) throw new UpdateError(this.entity, data);

      return entity;
    } catch (error) {
      console.error(error);
      throw new UpdateError(this.entity, data);
    }
  }

  public async deleteOne(
    filterData: Partial<T['$inferSelect']>
  ): Promise<T['$inferSelect']> {
    try {
      const keys = Object.keys(filterData) as Array<
      keyof Partial<typeof this.schema.$inferSelect>
      >;
      const values = Object.values(filterData) as Array<any>;

      const [entity] = await this.dbClient
        .delete(this.schema)
        .where(
          and(
            ...keys.map((key, index) => eq(this.schema[key], values[index])),
            eq(this.schema.isReadonly, false)
          )
        )
        .returning();

      if (!entity) throw new DeleteError(this.entity, filterData);

      return entity;
    } catch (error) {
      console.error(error);
      throw new DeleteError(this.entity, filterData);
    }
  }
}
