import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as tallySchemas from '../schemas';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import {
  eq,
  ExtractTablesWithRelations,
  inArray,
  ne,
  notInArray,
  sql
} from 'drizzle-orm';
import { TableRelationalConfig } from 'drizzle-orm';
import { RelationalQueryBuilder } from 'drizzle-orm/pg-core/query-builders/query';

export class TallyService<
  H extends Record<string, unknown>,
  T extends PgTableWithColumns<{
    name: string;
    schema: undefined;
    columns: Record<string, any>;
    dialect: 'pg';
  }>,
  K extends PgTableWithColumns<{
    name: string;
    schema: undefined;
    columns: Record<string, any>;
    dialect: 'pg';
  }>
> extends BaseServiceNew<H, T> {
  private tempSchema: K;

  constructor(
    db: PostgresJsDatabase<H>,
    schema: T,
    tempSchema: K,
    tableName: RelationalQueryBuilder<
      ExtractTablesWithRelations<H>,
      TableRelationalConfig
    >
  ) {
    super(db, schema, tableName);
    this.tempSchema = tempSchema;
  }

  public sync = async (data: Array<T['$inferInsert']>, companyId: string) => {
    const tableSchema = this.schema;
    const tempSchema = this.tempSchema;

    try {
      await this.dbClient.transaction(async (tx) => {
        await tx.delete(tempSchema).where(eq(tempSchema.companyId, companyId));
        await tx
          .insert(tempSchema)
          .values(data.map((obj) => ({ ...obj, companyId: companyId })));

        const subquery = tx
          .select({ masterID: tempSchema.masterID })
          .from(tempSchema)
          .innerJoin(tableSchema, eq(tempSchema.masterID, tableSchema.masterID))
          .where(ne(tableSchema.alterID, tempSchema.alterID));

        await tx
          .delete(tableSchema)
          .where(inArray(tableSchema.masterID, subquery));

        const insertSubquery: Array<(typeof tableSchema)['$inferSelect']> =
          await tx
            .select()
            .from(tempSchema)
            .where(
              notInArray(
                tempSchema.masterID,
                tx.select({ masterID: tableSchema.masterID }).from(tableSchema)
              )
            );

        await tx.insert(tableSchema).values(insertSubquery);
      });
    } catch (err) {
      throw err;
    }
  };
}
