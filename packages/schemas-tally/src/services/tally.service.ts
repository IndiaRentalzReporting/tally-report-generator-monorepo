import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as tallySchemas from '../schemas';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { ExtractTablesWithRelations, sql } from 'drizzle-orm';
import { TableRelationalConfig } from 'drizzle-orm';
import { RelationalQueryBuilder } from 'drizzle-orm/pg-core/query-builders/query';

export class TallyService<
H extends typeof tallySchemas,
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
}>,
>
extends BaseServiceNew<H,T>{
  
    private tempSchema : K;
  
    constructor(db: PostgresJsDatabase<H>, schema : T  ,tempSchema : K, tableName: RelationalQueryBuilder<
        ExtractTablesWithRelations<H>,
        TableRelationalConfig
      >) {
        super(db, schema , tableName);
        this.tempSchema = tempSchema;
    }



    public sync = async<DataType extends T['$inferInsert']>(data : DataType[],companyId : string)=>{
        const tableSchema = this.schema;
        const tempSchema = this.tempSchema;
        const rows = data.map(
            <ObjType extends (typeof tableSchema)['$inferInsert']>(
            obj: ObjType
            ): ObjType => {
            return { ...obj, companyId: companyId };
            }
        );
        try {
            await this.dbClient.transaction(async (tx) => {
            await tx.execute(
                sql`DELETE FROM ${tempSchema} WHERE ${tempSchema.companyId} = ${companyId} `
            );
            await tx.insert(tempSchema).values(rows);
            await tx.execute(sql`DELETE FROM ${tableSchema} WHERE ${tableSchema.masterID} IN(
                SELECT ${tempSchema.masterID} FROM ${tempSchema}
                INNER JOIN ${tableSchema} on ${tableSchema.masterID} = ${tempSchema.masterID} 
                WHERE ${tableSchema.alterID} != ${tempSchema.alterID})
                `);
            const query = sql`
                INSERT INTO ${tableSchema} 
                SELECT * FROM ${tempSchema} 
                WHERE ${tempSchema.masterID} NOT IN (
                SELECT ${tableSchema.masterID} FROM ${tableSchema}
                );  
            `;
            await tx.execute(query);
            });
        } catch (err) {
            throw err;
        }
    }
}
