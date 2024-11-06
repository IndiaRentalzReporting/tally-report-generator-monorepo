import { Column } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useCallback } from 'react';
import { Button } from '@trg_package/vite/components';

interface HeaderButtonProps<TData> {
  column: Column<TData, unknown>;
  label: string;
}

const SortingButton = <TData,>({ column, label }: HeaderButtonProps<TData>) => {
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
};

export default SortingButton;
