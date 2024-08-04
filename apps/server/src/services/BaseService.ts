import {
  ExtractTablesWithRelations,
  and,
  eq,
  TableRelationalConfig,
  DBQueryConfig,
  FindTableByDBName,
  BuildQueryResult,
  KnownKeysOnly
} from 'drizzle-orm';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import {
  PgRelationalQuery,
  RelationalQueryBuilder
} from 'drizzle-orm/pg-core/query-builders/query';
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
  protected entityName: string;

  constructor(
    protected schema: T,
    protected tableName: K
  ) {
    const { table } = schema.name;
    // @ts-ignore
    this.entityName = table[Object.getOwnPropertySymbols(table)[0]];
  }

  public async createOne(
    data: T['$inferInsert'],
    callback?: (entity: T['$inferSelect']) => any
  ): Promise<T['$inferSelect']> {
    const [entity] = await db.insert(this.schema).values(data).returning();

    if (!entity)
      throw new NotFoundError(`${this.entityName} returned as undefined`);

    if (callback) {
      await callback(entity);
    }

    return entity;
  }

  public async findAll(
    callback?: (entity: T['$inferSelect'][]) => any
  ): Promise<T['$inferSelect'][]> {
    const entity = await this.tableName.findMany();

    if (!entity.length) {
      throw new NotFoundError(`${this.entityName} does not exist`);
    }

    if (callback) {
      await callback(entity);
    }

    return entity;
  }

  public async findOne<
    TSelection extends Omit<
      DBQueryConfig<
        'many',
        true,
        ExtractTablesWithRelations<typeof schemas>,
        ExtractTablesWithRelations<typeof schemas>['RoleSchema']
      >,
      'limit'
    >
  >(
    data: Partial<T['$inferSelect']>,
    extra?: KnownKeysOnly<
      TSelection,
      Omit<
        DBQueryConfig<
          'many',
          true,
          ExtractTablesWithRelations<typeof schemas>,
          ExtractTablesWithRelations<typeof schemas>['RoleSchema']
        >,
        'limit'
      >
    >['with'],
    callback?: (entity: T['$inferSelect']) => any
  ): Promise<
    PgRelationalQuery<
      BuildQueryResult<
        ExtractTablesWithRelations<typeof schemas>,
        ExtractTablesWithRelations<typeof schemas>['RoleSchema'],
        TSelection
      >
    >
  > {
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
      throw new NotFoundError(`${this.entityName} does not exist`);
    }

    if (callback) {
      await callback(entity);
    }

    return entity;
  }

  public async updateOne(
    id: T['$inferSelect']['id'],
    data: T['$inferInsert'],
    callback?: (entity: T['$inferSelect']) => any
  ): Promise<T['$inferSelect']> {
    const [entity] = await db
      .update(this.schema)
      .set({ ...data })
      .where(eq(this.schema.id, id))
      .returning();

    if (!entity) throw new NotFoundError(`${this.entityName} does not exits`);

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

    if (!entity) throw new NotFoundError(`${this.entityName} does not exits`);

    if (callback) {
      await callback(entity);
    }

    return entity;
  }
}

export default BaseService;
