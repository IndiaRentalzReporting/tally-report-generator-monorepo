import {
  ExtractTablesWithRelations,
  and,
  eq,
  TableRelationalConfig
} from 'drizzle-orm';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { RelationalQueryBuilder } from 'drizzle-orm/pg-core/query-builders/query';
import { NotFoundError } from '../errors';
import db from '../models';
import * as schemas from '../models/schema';

class BaseService<
  T extends PgTableWithColumns<{
    name: string;
    schema: undefined;
    columns: Record<string, any>;
    dialect: 'pg';
  }>,
  K extends RelationalQueryBuilder<
    ExtractTablesWithRelations<typeof schemas>,
    TableRelationalConfig
  >
> {
  constructor(
    protected schema: T,
    protected tableName: K
  ) {}

  public async createOne(
    data: T['$inferInsert'],
    callback?: (entity: T['$inferSelect']) => any
  ): Promise<T['$inferSelect']> {
    const [entity] = await db.insert(this.schema).values(data).returning();

    if (!entity)
      throw new NotFoundError(`${this.schema.name} returned as undefined`);

    if (callback) {
      await callback(entity);
    }

    return entity;
  }

  public async findAll(
    data: Partial<T['$inferSelect']>,
    extra?: NonNullable<Parameters<K['findMany']>[0]>['with'],
    callback?: (entity: NonNullable<Awaited<ReturnType<K['findMany']>>>) => any
  ): Promise<NonNullable<Awaited<ReturnType<K['findMany']>>>> {
    const keys = Object.keys(data) as Array<
      keyof Partial<typeof this.schema.$inferSelect>
    >;
    const values = Object.values(data) as Array<any>;
    const entity = await this.tableName.findMany({
      where: and(
        ...keys.map((key, index) => eq(this.schema[key], values[index]))
      ),
      with: extra
    });

    if (!entity.length) {
      throw new NotFoundError(`${this.schema.name} does not exist`);
    }

    if (callback) {
      await callback(entity as NonNullable<Awaited<ReturnType<K['findMany']>>>);
    }

    return entity as NonNullable<Awaited<ReturnType<K['findMany']>>>;
  }

  public async findOne(
    data: Partial<T['$inferSelect']>,
    extra?: NonNullable<Parameters<K['findFirst']>[0]>['with'],
    callback?: (entity: NonNullable<Awaited<ReturnType<K['findFirst']>>>) => any
  ): Promise<NonNullable<Awaited<ReturnType<K['findFirst']>>>> {
    const keys = Object.keys(data) as Array<
      keyof Partial<typeof this.schema.$inferSelect>
    >;
    const values = Object.values(data) as Array<any>;

    const entity = await this.tableName.findFirst({
      where: and(
        ...keys.map((key, index) => eq(this.schema[key], values[index]))
      ),
      with: extra
    });

    if (!entity) {
      throw new NotFoundError(`${this.schema.name} does not exist`);
    }

    if (callback) {
      callback(entity as NonNullable<Awaited<ReturnType<K['findFirst']>>>);
    }

    return entity as NonNullable<Awaited<ReturnType<K['findFirst']>>>;
  }

  public async updateOne(
    id: T['$inferSelect']['id'],
    data: Partial<T['$inferInsert']>,
    callback?: (entity: T['$inferSelect']) => any
  ): Promise<T['$inferSelect']> {
    const [entity] = await db
      .update(this.schema)
      .set({ ...data })
      .where(eq(this.schema.id, id))
      .returning();

    if (!entity) throw new NotFoundError(`${this.schema.name} does not exits`);

    if (callback) {
      await callback(entity);
    }

    return entity;
  }

  public async deleteOneById(
    id: T['$inferSelect']['id'],
    callback?: (entity: T['$inferSelect']) => any
  ): Promise<T['$inferSelect']> {
    const [entity] = await db
      .delete(this.schema)
      .where(eq(this.schema.id, id))
      .returning();

    if (!entity) throw new NotFoundError(`${this.schema.name} does not exits`);

    if (callback) {
      await callback(entity);
    }

    return entity;
  }
}

export default BaseService;
