import { sql } from 'drizzle-orm';
import { ModuleColumns } from '@fullstack_package/interfaces';
import db from '../models';
import { ModuleInsert } from '../models/schema';

class DatabaseService {
  public static async createNewTable(
    name: string,
    columns: Array<{
      name: ModuleInsert['name'];
      type: ModuleColumns;
    }>
  ) {
    const columnsDefinition = columns
      .map((column) => `"${column.name}" ${column.type}`)
      .join(', ');

    return db.execute(
      sql`CREATE TABLE ${sql.identifier(name)} (${sql.raw(columnsDefinition)});`
    );
  }

  public static async dropTable(name: string) {
    const query = db.execute(sql`DROP TABLE ${sql.identifier(name)};`);
    return query;
  }
}

export default DatabaseService;
