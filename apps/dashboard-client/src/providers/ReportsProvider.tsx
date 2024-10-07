import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { ColumnSelect } from '@trg_package/schemas-reporting/types';
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

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { reportId } = useParams<{ reportId: string }>();

  const [columns, setColumns] = useState<ColumnSelect[]>([]);
  const [availableColumns, setAvailableColumns] = useState<ColumnSelect[]>([]);

  const { data: report } = useQuery({
    queryKey: ['reports', 'getOne', reportId],
    queryFn: () => services.read({ id: reportId }),
    select: (data) => data.data.reports[0],
    enabled: !!reportId
  });

  const { data: allColumns } = useQuery({
    queryKey: ['columns', 'getAll', report?.baseEntity],
    queryFn: () => services.getColumns({ tableId: report?.baseEntity || '' }),
    select: (data) => data.data.columns,
    enabled: !!report?.baseEntity
  });

  useEffect(() => {
    if (allColumns) {
      setAvailableColumns(allColumns);
    }
  }, [allColumns]);

  const addColumn = useCallback((column: ColumnSelect) => {
    setColumns((prev) => [...prev, column]);
    setAvailableColumns((prev) =>
      prev.filter((col) => col.name !== column.name)
    );
  }, []);

  const removeColumn = useCallback((column: ColumnSelect) => {
    setColumns((prev) => prev.filter((col) => col.name !== column.name));
    setAvailableColumns((prev) => [...prev, column]);
  }, []);

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
