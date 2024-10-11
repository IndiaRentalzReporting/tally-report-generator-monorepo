import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Check, Minus, X } from 'lucide-react';
import { Button, Else, If, Then } from '@trg_package/vite/components';
import { services } from '@/services/module';
import { DeleteEntity, UpdateEntity } from '@/components/composite';
import { State } from './interface';

export const columns: ColumnDef<State>[] = [
  {
    id: 'Module Name',
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="translate-x-[-10px]"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
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
      return (
        <span className="flex gap-4 items-center">
          <DeleteEntity
            options={{
              mutation: {
                mutationFn: () => services.deleteOne(module.id)
              },
              name: module.name,
              module: 'Modules'
            }}
          />
          <UpdateEntity module="Modules" id={module.id} />
        </span>
      );
    }
  }
];
