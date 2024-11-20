import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ReportUserSchema } from '../schemas';
import * as reportingSchemas from '../schemas';
import { ReportUserSelect } from '@/types';

export class ReportUserService extends BaseServiceNew<
  typeof reportingSchemas,
  typeof ReportUserSchema
> {
  constructor(db: PostgresJsDatabase<typeof reportingSchemas>) {
    super(db, ReportUserSchema, db.query.ReportUserSchema);
  }

  public async findMany(data: Partial<ReportUserSelect>): Promise<Array<ReportUserSelect>> {
    const reportUser = await this.dbClient.query.ReportUserSchema.findMany({
      with: {
        user: true
      }
    });
    return reportUser;
  }
}
