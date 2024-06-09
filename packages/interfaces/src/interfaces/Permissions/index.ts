import * as z from 'zod';
import { errorMessages } from '../../messages';

const Permissions = z.object({
  id: z.string().uuid({ message: errorMessages.invalid('UUID') }),
  can_create: z.boolean({ message: errorMessages.invalid('Boolean') }),
  can_read: z.boolean({ message: errorMessages.invalid('Boolean') }),
  can_update: z.boolean({ message: errorMessages.invalid('Boolean') }),
  can_delete: z.boolean({ message: errorMessages.invalid('Boolean') }),
  can_export: z.boolean({ message: errorMessages.invalid('Boolean') }),
  can_import: z.boolean({ message: errorMessages.invalid('Boolean') }),
  created_at: z.date({ message: errorMessages.invalid('Date') }),
  updated_at: z.date({ message: errorMessages.invalid('Date') })
});

export type Permissions = z.infer<typeof Permissions>;

const CreatePermissions = Permissions.omit({
  id: true,
  created_at: true,
  updated_at: true
});

export type CreatePermissions = z.infer<typeof CreatePermissions>;
