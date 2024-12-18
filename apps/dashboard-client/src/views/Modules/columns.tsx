import { ColumnDef } from '@tanstack/react-table';
import { Check, Minus, X } from 'lucide-react';
import { Else, If, Then } from '@trg_package/vite/components';
import Action from '@/components/composite/dashboard/Action';
import { SortingButton } from '@/components/composite/SortingButton';
import { FormState } from './interface';

export const columns: ColumnDef<FormState>[] = [
  {
    id: 'Module Name',
    accessorKey: 'name',
    header: ({ column }) => <SortingButton column={column} label="Name" />
  },
  {
    id: 'Module Privacy',
    accessorKey: 'isPrivate',
    header: ({ column }) => <SortingButton column={column} label="Private" />,
    cell: ({ cell }) => (
      <If condition={!!cell.getValue() as boolean}>
        <Then>
          <Check />
        </Then>
        <Else>
          <X />
        </Else>
      </If>
    )
  },
  {
    id: 'Module Icon',
    accessorKey: 'icon',
    header: 'Icon',
    cell: ({ cell }) => (
      <If condition={!!cell.getValue() as boolean}>
        <Then>
          <div
            dangerouslySetInnerHTML={{ __html: cell.getValue() as string }}
          />
        </Then>
        <Else>
          <Minus />
        </Else>
      </If>
    )
  },
  {
    id: 'Module Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const module = row.original;
      return (
          <Action
            module={{
              id: module.id,
              name: module.name,
              deleteType: 'Modules',
              updateType: 'Modules'
            }}
          />
      );
    }
  }
];
