import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit } from 'lucide-react';
import { Button } from '@trg_package/vite/components';
import { Link } from 'react-router-dom';
import { DeleteEntity } from '@/components/composite';
import { services } from '@/services/reports';
import { State } from './interface';

export const columns: ColumnDef<State>[] = [
  {
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
    accessorKey: 'description',
    header: 'Description'
  },
  {
    id: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const report = row.original;
      return (
        <span className="flex gap-4 items-center">
          <DeleteEntity
            options={{
              mutation: {
                mutationFn: () => services.deleteOne(report.id)
              },
              name: report.name,
              module: 'Reports'
            }}
          />
          <Link to={`/reports/${report.id}`}>
            <Edit size={20} className="text-green-500" />
          </Link>
        </span>
      );
    }
  }
];
