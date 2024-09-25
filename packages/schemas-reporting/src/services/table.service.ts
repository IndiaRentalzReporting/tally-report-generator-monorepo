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

}