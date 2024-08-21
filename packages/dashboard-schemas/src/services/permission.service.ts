import { BaseServiceNew } from '@trg_package/base-service';
import { PermissionSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dashboardSchemas from '../schemas';
import { PermissionActionService } from './permissionAction.service';

export class PermissionService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof PermissionSchema
> {
  private PermissionActionService: PermissionActionService;

  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, PermissionSchema, db.query.PermissionSchema);
    this.PermissionActionService = new PermissionActionService(db);
  }

  public async assignAction({
    permission_id,
    action_id
  }: {
    permission_id: string;
    action_id: string;
  }) {
    await this.PermissionActionService.createOne({ permission_id, action_id });
  }
}
