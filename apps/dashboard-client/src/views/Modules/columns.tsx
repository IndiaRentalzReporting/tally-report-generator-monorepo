import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown, Check, Minus, X
} from 'lucide-react';
import {
  Button, Else, If, Then
} from '@trg_package/vite/components';
import { useMemo } from 'react';
import { State } from './interface';
import Action from '@/components/composite/dashboard/Action';
import SortingButton from '@/components/composite/SortingButton';

export const columns: ColumnDef<State>[] = [
  {
    id: 'Module Name',
    accessorKey: 'name',
    header: ({ column }) => useMemo(() => <SortingButton column={column} label="Name" />, [column])
  },
  {
    id: 'Module Privacy',
    accessorKey: 'isPrivate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="translate-x-[-10px]"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Private
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
      return useMemo(
        () => (
          <Action
            module={{
              id: module.id,
              name: module.name,
              type: 'Modules'
            }}
          />
        ),
        [module]
      );
    }
  }
];
