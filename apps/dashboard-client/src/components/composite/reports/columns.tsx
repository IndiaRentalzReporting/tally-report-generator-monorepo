import { ColumnDef } from '@tanstack/react-table';
import { DetailedColumnSelect } from '@trg_package/schemas-reporting/types';
import { Button } from '@trg_package/vite/components';
import { Trash } from 'lucide-react';
import { Column as IColumn } from '@/providers/ReportsProvider';
import Column from './Column';

export const createColumn = (
  column: IColumn,
  removeColumn: (id: string | undefined) => void
): ColumnDef<DetailedColumnSelect> => ({
  id: column.column.displayName,
  accessorKey: column.column.displayName || 'No Name',
  header: () => (
    <div className="flex items-center gap-4">
      <span className='w-max'>{column.column.displayName}</span>
      <Button
        className="flex items-center justify-center"
        variant="ghost"
        onClick={() => removeColumn(column.column.id)}
      >
        <Trash color="red" className="h-4 w-4" />
      </Button>
    </div>
  ),
  cell: () => <Column column={column} />
});
