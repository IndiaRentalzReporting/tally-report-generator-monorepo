import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnSelect } from '@trg_package/schemas-reporting/types';
import { ColumnDef } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import { Button } from '@trg_package/vite/components';
import { services } from '@/services/reports';

interface ReportsProviderProps {
  children: React.ReactNode;
  tableId: string;
}

interface ReportsProviderState {
  columns: ColumnDef<ColumnSelect>[];
  availableColumns: ColumnDef<ColumnSelect>[];
  addColumn: (column: ColumnDef<ColumnSelect>) => void;
  removeColumn: (column: ColumnDef<ColumnSelect>) => void;
}

const initialState: ReportsProviderState = {
  columns: [],
  availableColumns: [],
  addColumn: () => null,
  removeColumn: () => null
};

const ReportsContext = createContext<ReportsProviderState>(initialState);

export const ReportsProvider: React.FC<ReportsProviderProps> = ({
  children,
  tableId
}) => {
  const [columns, setColumns] = useState<ColumnDef<ColumnSelect>[]>([]);
  const [availableColumns, setAvailableColumns] = useState<
    ColumnDef<ColumnSelect>[]
  >([]);

  const addColumn = useCallback((column: ColumnDef<ColumnSelect>) => {
    setColumns((prev) => [...prev, column]);
    setAvailableColumns((prev) => prev.filter((col) => col.id !== column.id));
  }, []);

  const removeColumn = useCallback((column: ColumnDef<ColumnSelect>) => {
    setColumns((prev) => prev.filter((col) => col.id !== column.id));
    setAvailableColumns((prev) => [...prev, column]);
  }, []);

  const { data: fetchedColumns } = useQuery({
    queryFn: () => services.getColumns({ tableId }),
    select: (data) => data.data.columns,
    enabled: !!tableId,
    queryKey: ['columns', 'getAll', tableId]
  });

  const createColumnDef = useCallback(
    (column: ColumnSelect): ColumnDef<ColumnSelect> => ({
      id: column.name,
      accessorKey: column.name,
      header: ({ column: col }) => (
        <Button className="translate-x-[-10px]" variant="ghost">
          {column.name}
          <Trash
            color="red"
            onClick={() =>
              removeColumn(col.columnDef as ColumnDef<ColumnSelect>)
            }
            className="ml-2 h-4 w-4"
          />
        </Button>
      )
    }),
    []
  );

  useEffect(() => {
    if (fetchedColumns) {
      const newColumnDefs = fetchedColumns.map(createColumnDef);
      setAvailableColumns(newColumnDefs);
    }
  }, [fetchedColumns, createColumnDef]);

  const contextValue = useMemo(
    (): ReportsProviderState => ({
      columns,
      availableColumns,
      addColumn,
      removeColumn
    }),
    [columns, availableColumns, addColumn, removeColumn]
  );

  return (
    <ReportsContext.Provider value={contextValue}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};
