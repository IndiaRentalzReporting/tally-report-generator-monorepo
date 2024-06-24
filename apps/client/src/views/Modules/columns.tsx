import { ColumnDef } from '@tanstack/react-table';
import { Check, Edit, Minus, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Module } from '@/models';
import DeleteEntity from '@/components/composite/DeleteEntity';
import services from '@/services';
import { Else, If, Then, When } from '@/components/utility';
import useIsAllowed from '@/lib/hooks/useIsAllowed';

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
    cell: ({ row }) => {
      const module = row.original;
      const queryClient = useQueryClient();
      const isEditAllowed = useIsAllowed({
        module: 'Modules',
        action: 'Update'
      });
      const isDeleteAllowed = useIsAllowed({
        module: 'Modules',
        action: 'Delete'
      });
      return (
        <span className="flex gap-4 items-center">
          <When condition={!!isDeleteAllowed}>
            <DeleteEntity
              options={{
                mutation: {
                  mutationFn: () => services.Modules.deleteOne(module.id),
                  onSuccess: () =>
                    queryClient.invalidateQueries({
                      queryKey: ['modules', 'getAll']
                    })
                },
                name: module.name,
                module: 'Module'
              }}
            />
          </When>
          <When condition={!!isEditAllowed}>
            <Link to={`/dashboard/Modules/Update/${module.id}`}>
              <Edit size={20} className="text-green-500" />
            </Link>
          </When>
        </span>
      );
    }
  }
];
