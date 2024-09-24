import { BaseServiceNew } from '@trg_package/base-service';
import * as reportingSchemas from "../schemas"
import { TableSchema , ColumnSchema} from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { TableSelect } from '@/schemas/table';
import { sql } from 'drizzle-orm';
import { CustomError } from '@trg_package/errors';
import { ReportColumnInsert } from '@/types/reportColumn';
import { ColumnSelect } from '@/types/Column';

export class TableService extends BaseServiceNew
<   
    typeof reportingSchemas,
    typeof TableSchema
>
{
    constructor(db: PostgresJsDatabase<typeof reportingSchemas>) {
        super(db, TableSchema,db.query.TableSchema);
    }

    public async getAllColumns(tableId : Pick<TableSelect,'id'>) : Promise<ColumnSelect[]>
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

    public async getTableQuery(tableId : Pick<TableSelect,'id'>, tableNames : String[]) : Promise<String>
    {
        try{
            const tableQuery = await this.dbClient.execute(sql`
                WITH RECURSIVE tbe(tablealias, tableid,tbe_query) AS (
                    SELECT 
                    c.name as tablealias,
                    rftb.id AS tableid,
                    concat('JOIN ',rftb.name,' ',c.name,' ON ', tb.name, '.',c.name,' = ',c.name,'.',rfc.name) as tbe_query
                    FROM public."column" c 
                    INNER JOIN public."table" tb ON c."tableId" = tb."id" 
                    INNER JOIN public."table" rftb ON c."referenceTableId" = rftb.id
                    INNER JOIN public."column" rfc ON rfc."id" = c."referenceColumnId"
                    WHERE c."tableId" =  ${tableId}
                    AND c."type" = 'foreignKey'
                    
                    UNION ALL
                    
                    SELECT 
                    CONCAT(tbe.tablealias,'_',c2.name) as tablealias,
                    rftb2.id AS tableid,
                    concat(tbe.tbe_query,' JOIN ',rftb2.name,' ',CONCAT(tbe.tablealias,'_',c2.name),' ON ', tbe.tablealias, '.',c2.name,' = ',CONCAT(tbe.tablealias,'_',c2.name),'.',rfc2.name) as tbe_query
                    FROM tbe  
                    INNER JOIN public."column" c2 ON c2."tableId" = tbe.tableid
                    INNER JOIN public."table" rftb2 ON c2."referenceTableId" = rftb2.id
                    INNER JOIN public."column" rfc2 ON rfc2."id" = c2."referenceColumnId"
                    WHERE c2."type" = 'foreignKey'
                )
                SELECT tbe.tablealias::TEXT, tbe.tbe_query::TEXT FROM tbe WHERE tbe.tablealias IN ${tableNames};
            `);

            let query = "";
            tableQuery.forEach((ele) => {
                query+=ele.tbe_query;
            });
            return query;
        }
        catch(error)
        {
            throw new CustomError("Unable to get the query for table",400);
        }
    }
}