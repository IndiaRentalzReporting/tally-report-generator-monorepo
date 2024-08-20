import { UserService } from '@trg_package/auth-schemas/services';
import { BaseServiceNew } from '@trg_package/base-service';
import config from '../config';
import * as authSchemas from '@trg_package/auth-schemas/schemas';

const { AUTH_PG_URL } = config;
const { client: auth_client } = BaseServiceNew.createClient(
  AUTH_PG_URL,
  authSchemas,
  {
    DB_MIGRATING: false,
    DB_SEEDING: false
  }
);

const USI = new UserService(auth_client);

export default USI;
