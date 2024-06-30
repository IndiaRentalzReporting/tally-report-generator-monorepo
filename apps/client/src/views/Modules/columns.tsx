import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Check, Minus, X } from 'lucide-react';
import { Module } from '@/models';
import services from '@/services';
import { Else, If, Then } from '@/components/utility';
import { DeleteEntity, UpdateEntity } from '@/components/composite';
import { Button } from '@/components/ui';

export const columns: ColumnDef<Module>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="translate-x-[-10px]"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="translate-x-[-10px]"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Private
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: 'isPrivate',
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
    header: 'Icon',
    accessorKey: 'icon',
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
    id: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const module = row.original;
      return (
        <span className="flex gap-4 items-center">
          <DeleteEntity
            options={{
              mutation: {
                mutationFn: () => services.Modules.deleteOne(module.id)
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
