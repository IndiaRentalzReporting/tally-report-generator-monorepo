import { BaseServiceNew } from '@trg_package/base-service';
import * as reportingSchemas from "../schemas"
import { ColumnSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CustomError } from '@trg_package/errors';
import { ColumnSelect, TableSelect } from '../types';
import { sql } from 'drizzle-orm';

export class ColumnService extends BaseServiceNew
<   
    typeof reportingSchemas,
    typeof ColumnSchema
>
{
    constructor(db: PostgresJsDatabase<typeof reportingSchemas>) {
        super(db, ColumnSchema,db.query.ColumnSchema);
    }


    
    public async getAllColumns(tableId : TableSelect['id']) : Promise<ColumnSelect[]>
    {
        try{
            const columns : ColumnSelect[] = await this.dbClient.execute(sql`
                WITH RECURSIVE cte(name, referenceTableId, tableId, tablealias, prefix, tablename, type) AS (
                    SELECT 
                    c.name,
                    c."referenceTableId",
                    c."tableId",
                    tb.name as tablealias,
                    ''::TEXT as prefix,
                    tb.name as tablename,
                    c.type
                    FROM  public."column" c
                    INNER JOIN  public."table" tb on c."tableId" = tb."id" 
                    WHERE c."tableId" = ${tableId}

                    UNION ALL
                    
                    SELECT 
                    pc.name, 
                    pc."referenceTableId",
                    pc."tableId",
                    concat(cte.prefix,cte.name) as tablealias,
                    concat(cte.name,'_') as prefix,
                    tb.name as tablename,
                    pc.type
                    FROM public."column" pc 
                    INNER JOIN cte ON pc."tableId" = cte.referencetableid
                    INNER JOIN  public."table" tb on pc."tableId" = tb."id"
                )
                SELECT cte."name",cte."type",cte."tablename" as table,cte."tablealias" FROM cte;
             `);
            return columns;
        }
        catch(error)
        {
            throw new CustomError("Error while fetching all columns",400);
        }

    }

    public updateForeignKeys(){
        try{
            this.dbClient.execute(sql`
                UPDATE column AS c1
                SET 
                "referenceTable" = c2."tableId"
                "referenceColumn" = c2."id"
                FROM 
                column c2  
                WHERE c2.name = c1."referenceColumn"
            `);
        }
        catch(error)
        {
            throw new CustomError("There was an error while updating seeded column table",400);
        }
    }
}