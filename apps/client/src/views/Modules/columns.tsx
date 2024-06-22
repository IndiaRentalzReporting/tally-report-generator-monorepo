import { ColumnDef } from '@tanstack/react-table';
import { Check, Edit, Minus, X } from 'lucide-react';
import { Module } from '@/models';
import DeleteEntity from '@/components/composite/DeleteEntity';
import services from '@/services';
import { Else, If, Then } from '@/components/utility';

export const columns: ColumnDef<Module>[] = [
  {
    id: 'Sr. No.',
    header: 'Sr. No.',
    cell: ({ row }) => <span>{row.index + 1}</span>
  },
  {
    header: 'Name',
    accessorKey: 'name'
  },
  {
    header: 'Private',
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
    cell: ({ row }) => (
      <span className="flex gap-4 items-center">
        <DeleteEntity deleteRoute={services.user.getAll} />
        <Edit size={20} className="text-green-500" />
      </span>
    )
  }
];
