import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CustomError } from '@trg_package/errors';
import { sql } from 'drizzle-orm';
import { ReportSchema } from '../schemas';
import * as reportingSchemas from '../schemas';

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
    const whereCondition = tableNames == null ? '' : `WHERE tbe.tablealias IN ${tableNames}`;
    try {
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
                SELECT tbe.tablealias::TEXT, tbe.tbe_query::TEXT FROM tbe ${whereCondition};
            `);

      let query = '';
      tableQuery.forEach((ele) => {
        query += ele.tbe_query;
      });
      return query;
    } catch (error) {
      throw new CustomError('Unable to get the query for table', 400);
    }
  }

  public getColumns(columns: (typeof ReportSchema)['$inferSelect']['columns']) {
    const str: any = [];
    columns?.map((column) => {
      str.push(`${column.table}."${column.name}" as "${column.alias}"`);
    });
    return str.join(', ');
  }

  public getConditions(
    conditions: (typeof ReportSchema)['$inferSelect']['conditons']
  ) {
    let str = ' WHERE ';
    conditions?.map((condition) => {
      str += ` ${condition.join} ${condition.column.alias} ${condition.operator} ${condition.value}`;
    });
    return str;
  }

  public getGroupBy(groupBy: (typeof ReportSchema)['$inferSelect']['groupBy']) {
    const str: any[] = [];
    groupBy?.map((ele) => {
      str.push(`${ele.alias}`);
    });
    return str.join(', ');
  }

  public async updateConfig(report: (typeof ReportSchema)['$inferSelect']) {
    // tables
    const tables = await this.getTableQuery(
      report.baseEntity as any,
      report.tables
    );
    // columns
    const columns = report.columns ? this.getColumns(report.columns) : '*';
    // conditions
    const conditions = report.conditons
      ? this.getConditions(report.conditons)
      : '';
    // group by
    const groupBy = report.groupBy ? this.getGroupBy(report.groupBy) : '';
  }

  public async saveReport(
    data: (typeof ReportSchema)['$inferInsert'],
    id: Pick<(typeof ReportSchema)['$inferSelect'], 'id'> | null = null
  ): Promise<(typeof ReportSchema)['$inferSelect']> {
    try {
      let report;
      if (id) {
        report = await this.updateOne({ id: data.id }, data);
      } else {
        report = await this.createOne(data);
      }
      // this.updateConfig(report);
      return report;
    } catch (e) {
      throw e;
    }
  }
}
