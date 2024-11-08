import { ColumnDef } from '@tanstack/react-table';
import { UseFormReturn } from 'react-hook-form';
import clsx from 'clsx';
import Action from '@/components/composite/dashboard/Action';
import { SortingButton } from '@/components/composite/SortingButton';
import { FormState, InsertState, SelectState } from './interface';

export const columns = (form?: UseFormReturn<FormState>)
: ColumnDef<InsertState | SelectState>[] => ([
  {
    id: 'Role Name',
    accessorFn: (row) => row.role?.name,
    header: ({ column }) => <SortingButton column={column} label="Role Name" />,
    getGroupingValue: (row) => `${row.role?.name}}`
  },
  {
    id: 'Module Name',
    accessorFn: (row) => row.module.name,
    header: ({ column }) => <SortingButton column={column} label="Module Name" />,
  },
  {
    id: 'Actions on Modules',
    accessorKey: 'permissionActions',
    header: ({ column }) => <SortingButton column={column} label="Actions on Modules" />,
    cell: ({ row }) => {
      const { permissionAction } = row.original;
      const actions = permissionAction.map((p) => p.action);
      return (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <div key={action.id} className='relative inline-block'>
              <label
                htmlFor={action.name}
                className={clsx(
                  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground',
                  'transition-all duration-200 ease-in-out',
                  'peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:scale-95',
                  !form && 'opacity-50 cursor-not-allowed',
                  !!form && 'hover:bg-secondary/20',
                )}
                style={{
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div className='flex items-center gap-2'>
                  <input
                    className='peer'
                    type='checkbox'
                    disabled={!form}
                    {...form?.register(`permissions.${row.index}.permissionAction.${index}.action.checked`)}
                  />
                  {action.name}
                </div>
              </label>
            </div>
          ))}
        </div>
      );
    }
  },
  {
    id: 'Permission Actions',
    accessorKey: 'Actions',
    header: 'Actions',
    aggregatedCell: ({ row }) => {
      const permission = row.original;
      return (
        <Action
          module={{
            id: permission.role?.id,
            name: permission.role?.name,
            type: 'Permissions'
          }}
        />
      );
    }
  }
]);
