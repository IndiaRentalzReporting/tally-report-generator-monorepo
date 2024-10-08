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
import {
  ColumnSelect,
  Operators,
  OperatorType
} from '@trg_package/schemas-reporting/types';
import { Column as CLM, ColumnDef } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import { Button } from '@trg_package/vite/components';
import { services } from '@/services/reports';
import { UpdateColumn } from '@/components/composite/reports/UpdateColumn';

interface ReportsProviderProps {
  children: React.ReactNode;
  tableId: string;
}

export type Column = { data: ColumnSelect; column: ColumnDef<ColumnSelect> };

export type GroupBy = ColumnSelect | undefined;

export type Condition = {
  id: number;
  column: ColumnSelect;
  operator: OperatorType['operator'];
  value: NonNullable<OperatorType['params']>[0];
  join: 'string';
};

export type Filter = {
  id: number;
  column: ColumnSelect;
  type: 'select' | 'search';
};

interface ReportsProviderState {
  columns: Column[];
  availableColumns: Column[];
  addColumn: (entity: Column) => void;
  removeColumn: (entity: Column) => void;
  groupBy: GroupBy;
  setGroupBy: React.Dispatch<React.SetStateAction<GroupBy>>;
  conditions: Array<Condition>;
  addConditions: (condition: Condition) => void;
  removeConditions: (condition: Condition) => void;
  getOperators: (column: ColumnSelect) => Pick<OperatorType, 'operator'>[];
  getValue: (
    column: ColumnSelect,
    operation: string
  ) => Pick<OperatorType, 'params'>;
  filters: Array<Filter>;
  addFilters: (filter: Filter) => void;
  removeFilters: (filter: Filter) => void;
}

const initialState: ReportsProviderState = {
  columns: [],
  availableColumns: [],
  addColumn: () => null,
  removeColumn: () => null,
  groupBy: undefined,
  setGroupBy: () => null,
  conditions: [],
  addConditions: () => null,
  removeConditions: () => null,
  getOperators: () => [],
  getValue: () => ({ params: [] }),
  filters: [],
  addFilters: () => null,
  removeFilters: () => null
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
  const [groupBy, setGroupBy] = useState<ReportsProviderState['groupBy']>(
    initialState.groupBy
  );
  const [conditions, setConditions] = useState<
    ReportsProviderState['conditions']
  >(initialState.conditions);
  const [filters, setFilters] = useState<ReportsProviderState['filters']>(
    initialState.filters
  );

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

  const addConditions: ReportsProviderState['addConditions'] = useCallback(
    (condition) => {
      setConditions((prev) => [...prev, condition]);
    },
    []
  );

  const removeConditions: ReportsProviderState['removeConditions'] =
    useCallback((condition) => {
      setConditions((prev) =>
        prev.filter((prevCondition) => prevCondition.id !== condition.id)
      );
    }, []);

  const addFilters: ReportsProviderState['addFilters'] = useCallback(
    (filter) => {
      setFilters((prev) => [...prev, filter]);
    },
    []
  );

  const removeFilters: ReportsProviderState['removeFilters'] = useCallback(
    (filter) => {
      setFilters((prev) =>
        prev.filter((prevFilter) => prevFilter.id !== filter.id)
      );
    },
    []
  );

  const getOperators: ReportsProviderState['getOperators'] = (column) =>
    Operators[column.type].map(({ operator }) => ({ operator }));

  const getValue: ReportsProviderState['getValue'] = (column, operation) => {
    const op = Operators[column.type].find((op) => op.operator === operation);
    if (!op) return { params: [] };
    return { params: op.params };
  };

  const { data: fetchedColumns } = useQuery({
    queryFn: () => services.getColumns({ tableId }),
    select: (data) => data.data.columns,
    enabled: !!tableId,
    queryKey: ['columns', 'getAll', tableId]
  });

  const createColumnDef = useCallback(
    (data: ColumnSelect): Column['column'] => ({
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
      removeColumn,
      groupBy,
      setGroupBy,
      conditions,
      addConditions,
      removeConditions,
      getOperators,
      getValue,
      filters,
      addFilters,
      removeFilters
    }),
    [
      columns,
      availableColumns,
      addColumn,
      removeColumn,
      groupBy,
      setGroupBy,
      conditions,
      addConditions,
      removeConditions,
      filters,
      addFilters,
      removeFilters
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

const HeaderButton: React.FC<{
  data: ColumnSelect;
  column: CLM<ColumnSelect>;
  removeColumn: ReportsProviderState['removeColumn'];
}> = ({ data, column, removeColumn }) => (
  <div className="flex items-center gap-4">
    <span>{data.name}</span>
    <Button className="flex items-center justify-center" variant="ghost">
      <Trash
        color="red"
        onClick={() => removeColumn({ column: column.columnDef, data })}
        className=" h-4 w-4"
      />
    </Button>
  </div>
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
