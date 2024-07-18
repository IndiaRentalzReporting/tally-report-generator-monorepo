import { ColumnType } from '@fullstack_package/interfaces';
import { sql } from 'drizzle-orm';
import db from '../models';
import { ModuleColumns, ModuleInsert } from '../models/schema';

class DatabaseService {
  public static async createNewTable(
    name: string,
    columns: Array<{
      name: ModuleInsert['name'];
      type: ModuleColumns;
    }>
  ): Promise<any> {
    const columnsDefinition = columns.map(
      (column) => `${column.name} ${column.type}`
    );
    console.log(`CREATE TABLE ${name} (${columnsDefinition});`);
    // return db.execute(sql`CREATE TABLE ${name} (${columnsDefinition})}`);
  }
}

export default DatabaseService;
