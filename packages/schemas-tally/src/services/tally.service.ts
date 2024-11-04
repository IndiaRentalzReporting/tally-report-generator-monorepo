import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import {
  eq,
  ExtractTablesWithRelations,
  inArray,
  ne,
  notInArray,
  TableRelationalConfig
} from 'drizzle-orm';
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
    const { tempSchema } = this;

    try {
      await this.dbClient.transaction(async (tx) => {
        await tx.delete(tempSchema).where(eq(tempSchema.companyId, companyId));
        await tx
          .insert(tempSchema)
          .values(data.map((obj) => ({ ...obj, companyId })));

        const subquery = tx
          .select({ masterId: tempSchema.masterId })
          .from(tempSchema)
          .innerJoin(tableSchema, eq(tempSchema.masterId, tableSchema.masterId))
          .where(ne(tableSchema.alterId, tempSchema.alterId));

        await tx
          .delete(tableSchema)
          .where(inArray(tableSchema.masterId, subquery));

        const insertSubquery: Array<(typeof tableSchema)['$inferSelect']> = await tx
          .select()
          .from(tempSchema)
          .where(
            notInArray(
              tempSchema.masterId,
              tx.select({ masterId: tableSchema.masterId }).from(tableSchema)
            )
          );

        if (insertSubquery.length > 0) { await tx.insert(tableSchema).values(insertSubquery); }
      });
    } catch (err) {
      throw err;
    }
  };
}
