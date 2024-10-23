import { BaseServiceNew } from '@trg_package/base-service';
import { CustomError } from '@trg_package/errors';
import { sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ReportSchema } from '../schemas';
import * as reportingSchemas from '../schemas';
import { ReportSelect } from '@/types';

export class ReportService extends BaseServiceNew<
  typeof reportingSchemas,
  typeof ReportSchema
> {
  constructor(db: PostgresJsDatabase<typeof reportingSchemas>) {
    super(db, ReportSchema, db.query.ReportSchema);
  }

  public async getTableQuery(
    tableId: Pick<(typeof ReportSchema)['$inferSelect'], 'baseEntity'>,
    tableNames: string[] | null = null
  ): Promise<string> {
    let query = '';
    try {
      if (tableNames != null) {
        const formattedTableNames = tableNames.map((e) => `'${e}'`).join(',');
        const whereCondition = `WHERE tbe.tablealias IN (${formattedTableNames})`;
        const sqlQuery = `WITH RECURSIVE tbe(tablealias, tableid,tbe_query,prefix) AS (
            SELECT 
            LOWER(c.name) as tablealias,
            rftb.id AS tableid,
            concat(
              'INNER JOIN public."',rftb.name,'" ',LOWER(c.name),' ON ', LOWER(tb.name), '."',c.name,'" = ',LOWER(c.name),'."',rfc.name , '" AND ',
              LOWER(tb.name), '."companyId" = ',LOWER(c.name),'."companyId"'
            )::text as tbe_query,
            c.name::text as prefix
            FROM public."column" c 
            INNER JOIN public."table" tb ON c."tableId" = tb."id" 
            INNER JOIN public."table" rftb ON c."referenceTable" = rftb.id::text
            INNER JOIN public."column" rfc ON rfc."id"::text = c."referenceColumn"
            WHERE c."tableId" = '${tableId}'
            AND c."type" = 'foreignKey'
            AND c."referenceTable" != '${tableId}'
            
            UNION ALL
            
            SELECT 
            LOWER(CONCAT(tbe.prefix,'_',c2.name))::TEXT as tablealias,
            rftb2.id AS tableid,
            concat(' INNER JOIN public."',rftb2.name,'" ',LOWER(CONCAT(tbe.tablealias,'_',c2.name)),' ON ', tbe.tablealias, '.',c2.name,' = ',CONCAT(tbe.tablealias,'_',c2.name),'.',rfc2.name,' AND ',tbe.tablealias, '.','"companyId"',' = ',CONCAT(tbe.tablealias,'_',c2.name),'.','"companyId"')::text as tbe_query,
            rftb2.name::text as prefix
            FROM tbe    
            INNER JOIN public."column" c2 ON c2."tableId" = tbe.tableid
            INNER JOIN public."table" rftb2 ON c2."referenceTable" = rftb2.id::text
            INNER JOIN public."column" rfc2 ON rfc2."id"::text = c2."referenceColumn"
            WHERE c2."type" = 'foreignKey'
            AND  tbe.tableid::text != c2."referenceTable" 
        )
        SELECT LOWER(tb.name::TEXT) as tablealias, CONCAT('public."',tb.name,'" ',LOWER(tb.name)) as tbe_query from public."table" tb WHERE tb."id" = '${tableId}'
        UNION ALL
        SELECT tbe.tablealias::TEXT, tbe.tbe_query::TEXT FROM tbe ${whereCondition};`;

        const tableQuery = await this.dbClient.execute(sql.raw(sqlQuery));
        tableQuery.forEach((ele) => {
          query += `${ele.tbe_query} `;
        });
      }
      return query;
    } catch (error) {
      throw new CustomError('Unable to get the query for table', 400);
    }
  }

  public async runConfigQuery<T>(
    dataSource : NonNullable<ReportSelect['queryConfig']>['dataSource']
  ) : Promise<T> {
    const escapedQuery = dataSource.replace(/\\\"/g, '"') ?? '';
    const data = await this.dbClient.execute(sql.raw(escapedQuery)) as T;
    return data;
  }
}
