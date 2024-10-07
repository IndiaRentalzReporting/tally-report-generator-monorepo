import { Column } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { memo, useCallback } from 'react';
import { Button } from '$/components';

interface HeaderButtonProps<TData> {
  column: Column<TData, unknown>;
  label: string; // Pass a dynamic label for the column header
}

function SortingButton<TData>({ column, label }: HeaderButtonProps<TData>) {
  const handleSort = useCallback(() => {
    column.toggleSorting(column.getIsSorted() === 'asc');
  }, [column]);

  return (
    <Button
      variant="ghost"
      className="translate-x-[-10px]"
      onClick={handleSort}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

const MemoizedSortingButton = memo(SortingButton) as <TData>(
  props: HeaderButtonProps<TData>
) => JSX.Element;

export default MemoizedSortingButton;
