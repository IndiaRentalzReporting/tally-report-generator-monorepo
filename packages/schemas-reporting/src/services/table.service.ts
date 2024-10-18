import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import { TableInsert } from '@/schemas/table';
import { TableSchema } from '../schemas';
import * as reportingSchemas from '../schemas';

export class TableService extends BaseServiceNew
  <
    typeof reportingSchemas,
    typeof TableSchema
  > {
  constructor(db: PostgresJsDatabase<typeof reportingSchemas>) {
    super(db, TableSchema,db.query.TableSchema);
  }

  public async seed() {
    const tables = await this.dbClient.execute(sql`SELECT 
                table_name as name,
                table_name as "displayName"
             FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name LIKE 'tally%';`) as TableInsert[];

    for (const table of tables) {
      const tableObject = {
        name: table.name,
        displayName: table.displayName.replace(/([a-z])([A-Z])/g, '$1 $2')
      };
      await this.createOne(tableObject);
    }
  }
}
