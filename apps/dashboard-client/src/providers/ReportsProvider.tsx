import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect
} from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnSelect,
  Operation,
  OperatorType
} from '@trg_package/schemas-reporting/types';
import { services } from '@/services/reports';

interface ReportsProviderProps {
  children: React.ReactNode;
  tableId: string;
}
export interface Condition {
  operator: OperatorType['operator'] | undefined;
  value: NonNullable<OperatorType['params']>[0] | undefined;
  join: 'AND' | 'OR' | 'NOT' | undefined;
}
export interface Filter {
  type: 'Select' | 'Search' | undefined;
}
export interface Extra {
  name: string | undefined;
  heading: string | undefined;
  operation: Operation['operationType'] | undefined;
  params: Operation['operationParams'][0] | undefined;
  showTotal: boolean;
}
export interface Column {
  column: ColumnSelect;
  condition: Condition;
  filter: Filter;
  extra: Extra;
}
interface ReportsProviderState {
  columns: Array<Column>;
  availableColumns: Array<Column>;
  addColumn: (entity: Column) => void;
  removeColumn: (entity: Column) => void;
  setCondition: (
    columnName: string | undefined,
    update: Partial<Condition>
  ) => void;
  setFilter: (columnName: string | undefined, update: Partial<Filter>) => void;
  setExtra: (columnName: string | undefined, update: Partial<Extra>) => void;
  groupBy: ColumnSelect | undefined;
  setGroupBy: React.Dispatch<React.SetStateAction<ColumnSelect | undefined>>;
}

const initialState: ReportsProviderState = {
  columns: [],
  availableColumns: [],
  addColumn: () => null,
  removeColumn: () => null,
  setCondition: () => null,
  setFilter: () => null,
  setExtra: () => null,
  groupBy: undefined,
  setGroupBy: () => null
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

  const addColumn = useCallback((entity: Column) => {
    setColumns((prev) => [...prev, entity]);
    setAvailableColumns((prev) =>
      prev.filter((col) => col.column.name !== entity.column.name)
    );
  }, []);

  const removeColumn = useCallback((entity: Column) => {
    setAvailableColumns((prevAvailable) => [...prevAvailable, entity]);
    setColumns((prevColumns) =>
      prevColumns.filter((col) => col.column.name !== entity.column.name)
    );
  }, []);

  const setCondition: ReportsProviderState['setCondition'] = useCallback(
    (columnName, update) => {
      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.column.name === columnName
            ? { ...col, condition: { ...col.condition, ...update } }
            : col
        )
      );
    },
    []
  );

  const setExtra: ReportsProviderState['setExtra'] = useCallback(
    (columnName, update) => {
      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.column.name === columnName
            ? { ...col, extra: { ...col.extra, ...update } }
            : col
        )
      );
    },
    []
  );

  const setFilter: ReportsProviderState['setFilter'] = useCallback(
    (columnName, update) => {
      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.column.name === columnName
            ? { ...col, filter: { ...col.filter, ...update } }
            : col
        )
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

  useEffect(() => {
    if (fetchedColumns) {
      setAvailableColumns(
        fetchedColumns.map<Column>((column) => ({
          column,
          condition: {
            operator: undefined,
            value: undefined,
            join: undefined
          },
          filter: {
            type: undefined
          },
          extra: {
            name: column.name,
            heading: column.name,
            operation: '',
            params: '',
            showTotal: column.type === 'number'
          }
        }))
      );
    }
  }, [fetchedColumns]);

  const contextValue = useMemo(
    () => ({
      columns,
      availableColumns,
      addColumn,
      removeColumn,
      setCondition,
      setFilter,
      setExtra,
      groupBy,
      setGroupBy
    }),
    [
      columns,
      availableColumns,
      addColumn,
      removeColumn,
      setCondition,
      setFilter,
      setExtra,
      groupBy,
      setGroupBy
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
