import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnSelect } from '@trg_package/schemas-reporting/types';
import { ColumnDef, Column as CLM } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import { Button } from '@trg_package/vite/components';
import { services } from '@/services/reports';
import { UpdateColumn } from '@/components/composite/reports/UpdateColumn';

interface ReportsProviderProps {
  children: React.ReactNode;
  tableId: string;
}

export type Column = { data: ColumnSelect; column: ColumnDef<ColumnSelect> };

interface ReportsProviderState {
  columns: Column[];
  availableColumns: Column[];
  addColumn: (entity: Column) => void;
  removeColumn: (entity: Column) => void;
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
  const [columns, setColumns] = useState<ReportsProviderState['columns']>(
    initialState.columns
  );
  const [availableColumns, setAvailableColumns] = useState<
    ReportsProviderState['availableColumns']
  >(initialState.availableColumns);

  const addColumn: ReportsProviderState['addColumn'] = useCallback((entity) => {
    setColumns((prev) => [...prev, entity]);
    setAvailableColumns((prev) =>
      prev.filter((prevEntity) => prevEntity.column.id !== entity.column.id)
    );
  }, []);

  const removeColumn: ReportsProviderState['removeColumn'] = useCallback(
    (entity) => {
      setAvailableColumns((prev) => [...prev, entity]);
      setColumns((prev) =>
        prev.filter((prevEntity) => prevEntity.column.id !== entity.column.id)
      );
    },
    []
  );

  const { data: fetchedColumns } = useQuery({
    queryFn: () => services.getColumns({ tableId }),
    select: (data) => data.data.columns,
    enabled: !!tableId,
    queryKey: ['columns', 'getAll', tableId]
  });

  const createColumnDef = useCallback(
    (data: ColumnSelect): ColumnDef<ColumnSelect> => ({
      id: data.name,
      accessorKey: data.name,
      header: ({ column }) =>
        useMemo(
          () => (
            <MemoizedHeaderButton
              column={column}
              data={data}
              removeColumn={removeColumn}
            />
          ),
          [column]
        ),
      cell: ({ row }) => {
        const column = row.original;
        return useMemo(
          () => <MemoizedUpdateButton column={column} />,
          [column]
        );
      }
    }),
    []
  );

  useEffect(() => {
    if (fetchedColumns) {
      const newColumnDefs = fetchedColumns.map((column) => ({
        data: column,
        column: createColumnDef(column)
      }));
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

const HeaderButton: React.FC<{
  data: ColumnSelect;
  column: CLM<ColumnSelect>;
  removeColumn: ReportsProviderState['removeColumn'];
}> = ({ data, column, removeColumn }) => (
  <Button className="translate-x-[-10px]" variant="ghost">
    {data.name}
    <Trash
      color="red"
      onClick={() => removeColumn({ column: column.columnDef, data })}
      className="ml-2 h-4 w-4"
    />
  </Button>
);

const MemoizedHeaderButton = memo(HeaderButton);

const UpdateButton: React.FC<{
  column: ColumnSelect;
}> = ({ column }) => (
  <div className="flex items-center justify-center h-[30vh] hover:bg-muted/50  rounded-md">
    <UpdateColumn
      module={{
        id: column.name,
        name: column.name,
        type: 'Reports'
      }}
    />
  </div>
);

const MemoizedUpdateButton = memo(UpdateButton);
