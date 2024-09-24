import { BaseServiceNew } from '@trg_package/base-service';
import * as reportingSchemas from "../schemas"
import { ReportSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ReportInsert, ReportSelect } from '@/schemas/report';

export class ReportService extends BaseServiceNew
<   
    typeof reportingSchemas,
    typeof ReportSchema
>
{
    constructor(db: PostgresJsDatabase<typeof reportingSchemas>) {
        super(db, ReportSchema,db.query.ReportSchema);
    }

}