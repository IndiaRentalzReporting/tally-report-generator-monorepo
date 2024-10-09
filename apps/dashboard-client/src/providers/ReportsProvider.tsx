import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect
} from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnSelect,
  OperatorType
} from '@trg_package/schemas-reporting/types';
import { ColumnDef } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import { Button } from '@trg_package/vite/components';
import { services } from '@/services/reports';
import { UpdateColumn } from '@/components/composite/reports/UpdateColumn';

interface ReportsProviderProps {
  children: React.ReactNode;
  tableId: string;
}
export interface Column {
  column: ColumnSelect;
  columnDef: ColumnDef<ColumnSelect>;
}
export type GroupBy = ColumnSelect | undefined;
export interface Condition {
  id: number;
  column: ColumnSelect | undefined;
  operator: OperatorType['operator'] | undefined;
  value: NonNullable<OperatorType['params']>[0] | undefined;
  join: 'AND' | 'OR' | 'NOT' | undefined;
}
export interface Filter {
  id: number;
  column: ColumnSelect | undefined;
  type: 'Select' | 'Search' | undefined;
}
interface ReportsProviderState {
  columns: Column[];
  availableColumns: Column[];
  addColumn: (entity: Column) => void;
  removeColumn: (entity: Column) => void;

  groupBy: GroupBy;
  setGroupBy: React.Dispatch<React.SetStateAction<GroupBy>>;

  conditions: Array<Condition>;
  updateCondition: (
    id?: number | null,
    condition?: Partial<Omit<Condition, 'id'>>
  ) => void;

  removeCondition: (id: number) => void;
  filters: Array<Filter>;
  updateFilter: (
    id?: number | null,
    filter?: Partial<Omit<Filter, 'id'>>
  ) => void;
  removeFilter: (id: number) => void;
}

export const defaultFilter: Omit<Filter, 'id'> = {
  column: undefined,
  type: undefined
};

export const defaultCondition: Omit<Condition, 'id'> = {
  column: undefined,
  operator: undefined,
  value: undefined,
  join: undefined
};

const initialState: ReportsProviderState = {
  columns: [],
  availableColumns: [],
  addColumn: () => null,
  removeColumn: () => null,

  groupBy: undefined,
  setGroupBy: () => null,

  conditions: [],
  updateCondition: () => null,
  removeCondition: () => null,

  filters: [],
  updateFilter: () => null,
  removeFilter: () => null
};

const ReportsContext = createContext<ReportsProviderState>(initialState);

export const ReportsProvider: React.FC<ReportsProviderProps> = ({
  children,
  tableId
}) => {
  const [columns, setColumns] = useState(initialState.columns);
  const [availableColumns, setAvailableColumns] = useState(
    initialState.availableColumns
  );
  const [groupBy, setGroupBy] = useState(initialState.groupBy);
  const [conditions, setConditions] = useState(initialState.conditions);
  const [filters, setFilters] = useState(initialState.filters);

  const addColumn = useCallback((entity: Column) => {
    setColumns((prev) => [...prev, entity]);
    setAvailableColumns((prev) =>
      prev.filter((col) => col.columnDef.id !== entity.columnDef.id)
    );
  }, []);

  const removeColumn = useCallback((entity: Column) => {
    setAvailableColumns((prevAvailable) =>
      prevAvailable.filter((col) => col.columnDef.id !== entity.columnDef.id)
    );
    setColumns((prevColumns) =>
      prevColumns.filter((col) => col.columnDef.id !== entity.columnDef.id)
    );
    setConditions((prevConditions) =>
      prevConditions.filter((cond) => cond.column?.name !== entity.column.name)
    );
    setFilters((prevFilters) =>
      prevFilters.filter((filter) => filter.column?.name !== entity.column.name)
    );
  }, []);

  const updateCondition: ReportsProviderState['updateCondition'] = useCallback(
    (id = null, updates) => {
      setConditions((prev) => {
        if (id === null) {
          return [...prev, { ...defaultCondition, id: Date.now() }];
        }

        return prev.map((condition) =>
          condition.id === id ? { ...condition, ...updates } : condition
        );
      });
    },
    []
  );

  const removeCondition = useCallback((id: number) => {
    setConditions((prev) => prev.filter((cond) => cond.id !== id));
  }, []);

  const updateFilter: ReportsProviderState['updateFilter'] = useCallback(
    (id = null, updates) => {
      setFilters((prev) => {
        if (id === null) {
          return [...prev, { ...defaultFilter, id: Date.now() }];
        }

        return prev.map((filter) =>
          filter.id === id ? { ...filter, ...updates } : filter
        );
      });
    },
    []
  );

  const removeFilter = useCallback((id: number) => {
    setFilters((prev) => prev.filter((filter) => filter.id !== id));
  }, []);

  const { data: fetchedColumns } = useQuery({
    queryFn: () => services.getColumns({ tableId }),
    select: (data) => data.data.columns,
    enabled: !!tableId,
    queryKey: ['columns', 'getAll', tableId]
  });

  const createColumnDef = useCallback(
    (data: ColumnSelect): Column['columnDef'] => ({
      id: data.name,
      accessorKey: data.name,
      header: () => (
        <MemoizedHeaderButton column={data} removeColumn={removeColumn} />
      ),
      cell: ({ row }) => <MemoizedUpdateButton column={row.original} />
    }),
    [removeColumn]
  );

  useEffect(() => {
    if (fetchedColumns) {
      const newColumnDefs = fetchedColumns.map((col) => ({
        column: col,
        columnDef: createColumnDef(col)
      }));
      setAvailableColumns(newColumnDefs);
    }
  }, [fetchedColumns, createColumnDef]);

  const contextValue = useMemo(
    () => ({
      columns,
      availableColumns,
      addColumn,
      removeColumn,
      groupBy,
      setGroupBy,
      conditions,
      updateCondition,
      removeCondition,
      filters,
      updateFilter,
      removeFilter
    }),
    [
      columns,
      availableColumns,
      addColumn,
      removeColumn,
      updateCondition,
      removeCondition,
      groupBy,
      conditions,
      filters,
      updateFilter,
      removeFilter
    ]
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

// Memoized components for header and update buttons
const HeaderButton: React.FC<{
  column: ColumnSelect;
  removeColumn: ReportsProviderState['removeColumn'];
}> = ({ column, removeColumn }) => (
  <div className="flex items-center gap-4">
    <span>{column.name}</span>
    <Button className="flex items-center justify-center" variant="ghost">
      <Trash
        color="red"
        onClick={() => removeColumn({ columnDef: { id: column.name }, column })}
        className="h-4 w-4"
      />
    </Button>
  </div>
);

const MemoizedHeaderButton = memo(HeaderButton);

const UpdateButton: React.FC<{ column: ColumnSelect }> = ({ column }) => (
  <div className="flex items-center justify-center h-[30vh] hover:bg-muted/50 rounded-md">
    <UpdateColumn
      module={{ id: column.name, name: column.name, type: 'Reports' }}
    />
  </div>
);

const MemoizedUpdateButton = memo(UpdateButton);
