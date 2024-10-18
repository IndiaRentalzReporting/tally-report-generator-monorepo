import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CustomError } from '@trg_package/errors';
import { sql } from 'drizzle-orm';
import * as reportingSchemas from '../schemas';
import { ColumnSchema } from '../schemas';
import { DetailedColumnSelect, TableSelect } from '../types';

export class ColumnService extends BaseServiceNew
  <
    typeof reportingSchemas,
    typeof ColumnSchema
  > {
  constructor(db: PostgresJsDatabase<typeof reportingSchemas>) {
    super(db, ColumnSchema,db.query.ColumnSchema);
  }

  public async getAllColumns(tableId : TableSelect['id']) : Promise<DetailedColumnSelect[]> {
    try {
      const columns : DetailedColumnSelect[] = await this.dbClient.execute(sql`
        WITH RECURSIVE cte(reference_column_id,name, referenceTable, tableId, tablealias, prefix, tablename, type) AS (
          SELECT 
					c."referenceColumn" as reference_column_id,
          c.name,
          c."referenceTable",
          c."tableId",
          tb.name::TEXT as tablealias,
          ''::TEXT as prefix,
          tb.name as tablename,
          CASE 
					    WHEN c.type = 'foreignKey' AND c."referenceTable" = c."tableId"::TEXT 
					    THEN 'string' 
					    ELSE c.type
          END AS type
          FROM  public."column" c
          INNER JOIN  public."table" tb on c."tableId" = tb."id" 
          WHERE c."tableId" = ${tableId}
					AND c.type NOT IN  ('id')

          UNION ALL
                    
          SELECT 
					pc."referenceColumn" as reference_column_id,
          pc.name, 
          pc."referenceTable",
          pc."tableId",
          concat(cte.prefix,cte.name) as tablealias,
          concat(cte.name,'_') as prefix,
          tb.name as tablename,
          CASE 
            WHEN pc.type = 'foreignKey' AND pc."referenceTable" = pc."tableId"::TEXT 
            THEN 'string' 
            ELSE pc.type
          END AS type
          FROM public."column" pc 
          INNER JOIN cte ON pc."tableId"::TEXT = cte.referencetable
          INNER JOIN  public."table" tb on pc."tableId" = tb."id"
	 				WHERE cte.tableid != pc."tableId" 
					AND pc.type != 'id'
					AND pc.id::TEXT != cte.reference_column_id
        )
        SELECT cte."name",cte."type",cte."tablename" as table,
				lower(cte."tablealias") as table_alias,
				concat(replace(cte."tablename",'tally',''),'.',cte."name") as "displayName",
				CONCAT(LOWER(cte."tablealias"),'_',LOWER(cte."name")) as alias
				FROM cte ;
      `);
      return columns;
    } catch (error) {
      throw new CustomError('Error while fetching all columns',400);
    }
  }

  public async updateForeignKeys() {
    try {
      await this.dbClient.execute(sql`
                UPDATE public."column" AS c1
                SET 
                "referenceTable" = t2."id",
                "referenceColumn" = c2."id"
                FROM 
                public."column" AS c2  
                INNER JOIN public."table" as t2
                on c2."tableId" = t2.id
                WHERE c2.name = c1."referenceColumn"
                and t2.name = c1."referenceTable"
            `);
    } catch (error) {
      throw new CustomError('There was an error while updating seeded column table',400);
    }
  }
}
