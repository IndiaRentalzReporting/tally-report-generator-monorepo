import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ReportInsert, ReportSelect } from '@/schemas/report';
import { ColumnSelect, ReportColumnSelect, ReportConfigSelect, TableSelect } from '../types';
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
    tableNames: String[] | null = null
  ): Promise<string> {
   
    let query ="";
    try {
      if(tableNames != null)
      {
        const formattedTableNames = tableNames.map((e) => `'${e}'`).join(',');
        let whereCondition=`WHERE tbe.tablealias IN (${formattedTableNames})`;


        const tableQuery = await this.dbClient.execute(sql`
                     WITH RECURSIVE tbe(tablealias, tableid,tbe_query) AS (
                      SELECT 
                      c.name::text as tablealias,
                      rftb.id AS tableid,
                      concat('INNER JOIN ',rftb.name,' ',c.name,' ON ', tb.name, '.',c.name,' = ',c.name,'.',rfc.name) as tbe_query
                      FROM public."column" c 
                      INNER JOIN public."table" tb ON c."tableId" = tb."id" 
                      INNER JOIN public."table" rftb ON c."referenceTable" = rftb.id::text
                      INNER JOIN public."column" rfc ON rfc."id"::text = c."referenceColumn"
                      WHERE c."tableId" = ${tableId}
                      AND c."type" = 'foreignKey'
	   					        AND c."referenceTable" != ${tableId}
                      
                      UNION ALL
                      
                      SELECT 
                      CONCAT(tbe.tablealias,'_',c2.name) as tablealias,
                      rftb2.id AS tableid,
                      concat(tbe.tbe_query,' INNER JOIN ',rftb2.name,' ',lower(CONCAT(tbe.tablealias,'_',c2.name)),' ON ', tbe.tablealias, '.',c2.name,' = ',CONCAT(tbe.tablealias,'_',c2.name),'.',rfc2.name,' AND ',tbe.tablealias, '.','"companyId"',' = ',CONCAT(tbe.tablealias,'_',c2.name),'.','"companyId"') as tbe_query
                      FROM tbe  
                      INNER JOIN public."column" c2 ON c2."tableId" = tbe.tableid
                      INNER JOIN public."table" rftb2 ON c2."referenceTable" = rftb2.id::text
                      INNER JOIN public."column" rfc2 ON rfc2."id"::text = c2."referenceColumn"
                      WHERE c2."type" = 'foreignKey'
	   				          AND  tbe.tableid::text != c2."referenceTable" 
                  )
                  SELECT tb.name::TEXT as tablealias, tb.name::TEXT as tbe_query from public."table" tb WHERE tb."id" = ${tableId}
                  UNION ALL
                  SELECT tbe.tablealias::TEXT, tbe.tbe_query::TEXT FROM tbe ;
              `);
  
        tableQuery.forEach((ele) => {
          query += ele.tbe_query + " ";
        });
      }
      return query;
    } catch (error) {
      throw new CustomError('Unable to get the query for table', 400);
    }
  }

  public getColumns(columns: (typeof ReportSchema)['$inferSelect']['columns']) {
    let str: any = [];  
    columns?.map((ele) => {
      const {column} = ele;
      str.push(`${column.tablealias}.${column.name} as \"${column.alias}\"`);
    });
    return str.join(', ');
  }

  public getConditions(
    conditions: (typeof ReportSchema)['$inferSelect']['conditons']
  ) {
    let str = ' WHERE ';
    conditions?.map((condition) => {
      const {column} = condition;
      str += ` ${condition.join} ${column.alias} ${condition.operator} ${condition.value}`;
    });
    return str;
  }

  public getGroupBy(groupBy: (typeof ReportSchema)['$inferSelect']['groupBy']) {
    const str: any[] = [];
    groupBy?.map((ele) => {
      str.push(`${ele.column.alias}`);
    });
    return str.join(', ');
  }
  public async updateConfig(report: (typeof ReportSchema)['$inferSelect']) :  Promise<(typeof ReportSchema)['$inferSelect']> {
    //tables
    const tables = await this.getTableQuery(
      report.baseEntity as any,
      report.tables
    );

    //columns
    const columns = report.columns ? this.getColumns(report.columns) : '*';
    
    //conditions
    const conditions = report.conditons
      ? this.getConditions(report.conditons)
      : '';
    // group by
    const groupBy = report.groupBy ? this.getGroupBy(report.groupBy) : '';
  
  
    const query = `SELECT ${columns} FROM ${tables} ${conditions} ${groupBy}`;


    let columnArr : ReportColumnSelect[] | undefined;

    columnArr = report.columns?.map(e=>{
      return {
        heading : e.heading,
        alias : e.column.alias
      }
    })

    const reportConfig : ReportConfigSelect = {
      dataSource : query,
      columns : columnArr??null,
      filters : null
    }

    return await this.updateOne({id : report.id},{queryConfig : reportConfig});

  }



  public async saveReport(
    data: (typeof ReportSchema)['$inferInsert'],
    id: Pick<(typeof ReportSchema)['$inferSelect'], 'id'> | null = null
  ): Promise<(typeof ReportSchema)['$inferSelect']> {
    try {
      let report;
      if (id !== null) {
        report = await this.updateOne({ id : id as any }, data);
      } else {
        report = await this.createOne(data);
      }
      report = await this.updateConfig(report);
      return report;
    } catch (e) {
      throw e;
    }
  }
}
