import { User } from '@fullstack_package/interfaces';
import { ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { Checkbox } from '@/components/ui/checkbox';

interface UserWithRole extends User {
  roles: string[];
}
export const columns: ColumnDef<UserWithRole>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    )
  },
  {
    accessorKey: 'first_name',
    header: 'First Name'
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'roles',
    header: 'Roles',
    cell: ({ getValue }) => {
      // @ts-ignore
      const roles: { name: string; id: string }[] = getValue();
      return (
        <span>
          {roles.map((role, index) => (
            <span className={clsx(index > 0 && 'ms-2')}>{role.name}</span>
          ))}
        </span>
      );
    }
  }
];
