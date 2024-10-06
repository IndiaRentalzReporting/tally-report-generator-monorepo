import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  ColumnSelect,
  TableSelect
} from '@trg_package/schemas-reporting/types';
import { useQuery } from '@tanstack/react-query';
import { services } from '@/services/reports';

interface ReportsProviderState {
  columns: ColumnSelect[];
  availableColumns: ColumnSelect[];
  addColumn: (column: ColumnSelect) => void;
  removeColumn: (column: ColumnSelect) => void;
}

const initialState: ReportsProviderState = {
  columns: [],
  availableColumns: [],
  addColumn: () => null,
  removeColumn: () => null
};

const ReportsContext = createContext<ReportsProviderState>(initialState);

export const ReportsProvider = ({
  children,
  tableId
}: {
  children: React.ReactNode;
  tableId: TableSelect['id'];
}) => {
  const [state, setState] =
    useState<Omit<ReportsProviderState, 'addColumn' | 'removeColumn'>>(
      initialState
    );
  const { data: allColumns } = useQuery({
    queryFn: () => services.getColumns({ tableId }),
    select: (data) => data.data.columns,
    queryKey: ['columns', 'getAll']
  });

  const addColumn = useCallback((column: ColumnSelect) => {
    setState((prev) => ({
      columns: [...prev.columns, column],
      availableColumns: prev.availableColumns.filter(
        (col) => col.name !== column.name
      )
    }));
  }, []);

  const removeColumn = useCallback((column: ColumnSelect) => {
    setState((prev) => ({
      columns: prev.columns.filter((col) => col.name !== column.name),
      availableColumns: [...prev.availableColumns, column]
    }));
  }, []);

  useEffect(() => {
    if (!allColumns) return;
    setState((prev) => ({ ...prev, availableColumns: allColumns }));
  }, [allColumns]);

  const contextValue = useMemo(
    () => ({ ...state, addColumn, removeColumn }),
    [state, addColumn, removeColumn]
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
