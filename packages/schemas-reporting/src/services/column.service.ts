import { BaseServiceNew } from '@trg_package/base-service';
import * as reportingSchemas from "../schemas"
import { ColumnSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ColumnService extends BaseServiceNew
<   
    typeof reportingSchemas,
    typeof ColumnSchema
>
{
    constructor(db: PostgresJsDatabase<typeof reportingSchemas>) {
        super(db, ColumnSchema,db.query.ColumnSchema);
    }
}