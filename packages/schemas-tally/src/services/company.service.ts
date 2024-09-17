import { BaseServiceNew } from '@trg_package/base-service';
import { CompanySchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as tallySchemas from '../schemas';
import { RelationalQueryBuilder } from 'drizzle-orm/pg-core/query-builders/query';
import { and, eq, ExtractTablesWithRelations } from 'drizzle-orm';
import { TableRelationalConfig } from 'drizzle-orm';
import { NotFoundError } from '@trg_package/errors';


export class CompanyService extends BaseServiceNew<
  typeof tallySchemas,
  typeof CompanySchema
> {
  constructor(db: PostgresJsDatabase<typeof tallySchemas>) {
    super(db, CompanySchema, db.query.CompanySchema);
  }


  public async findCompanies(
    data: Partial<typeof CompanySchema['$inferSelect']> = {},
    columns : { [ key in keyof Partial<typeof CompanySchema['$inferSelect']>]? : boolean } = {},
    extra?: Omit<
      NonNullable<
        Parameters<
          RelationalQueryBuilder<
            ExtractTablesWithRelations<typeof tallySchemas>,
            TableRelationalConfig
          >['findFirst']
        >[0]
      >,
      'where'
    >
  ): Promise<Partial<typeof CompanySchema['$inferSelect']>[]> {
    const keys = Object.keys(data) as Array<
      keyof Partial<typeof this.schema.$inferSelect>
    >;
    const values = Object.values(data) as Array<any>;
    const entity = await this.tableName.findMany({
      columns,
      where: and(
        ...keys.map((key, index) => eq(this.schema[key], values[index]))
      ),
      ...extra
    });

    if (!entity.length) {
      throw new NotFoundError(`${this.schema._?.name} does not exist`);
    }

    return entity;
  }
}
