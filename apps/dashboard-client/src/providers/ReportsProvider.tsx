import React, {
  useContext, useMemo, useCallback, useState,
  createContext
} from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ReportSelect
} from '@trg_package/schemas-reporting/types';
import { services } from '@/services/reports';

export type Column = Partial<ReportSelect['columns'][number]>;
export type Condition = Partial<ReportSelect['conditions'][number]>;
export type Filter = Partial<ReportSelect['filters'][number]>;
export type GroupBy = Partial<ReportSelect['groupBy'][number]>;

interface ReportsProviderState {
  fetchingColumns: boolean,

  columns: Array<Column>;
  availableColumns: Array<Column>;
  addColumn: (id: string | undefined) => void;
  removeColumn: (id: string | undefined) => void;
  updateColumn: (id: string | undefined, update: Partial<Column>) => void;

  conditions: Array<Condition>;
  addCondition: () => void;
  removeCondition: (id: string | undefined) => void;
  updateCondition: (id: string | undefined, update: Partial<Condition>) => void;

  filters: Array<Filter>;
  addFilter: () => void;
  removeFilter: (id: string | undefined) => void;
  updateFilter: (id: string | undefined, update: Partial<Filter>) => void;

  groupBy: Array<GroupBy>;
  setGroupBy: React.Dispatch<React.SetStateAction<Array<GroupBy>>>;
}

const ReportsContext = createContext<ReportsProviderState | undefined>(undefined);

interface ReportsProviderProps {
  children: React.ReactNode;
  tableId: string;
  reportId: string
}

export const ReportsProvider: React.FC<ReportsProviderProps> = (
  { children, tableId, reportId }
) => {
  const [columns, setColumns] = useState<ReportsProviderState['columns']>([]);
  const [groupBy, setGroupBy] = useState<ReportsProviderState['groupBy']>([]);
  const [filters, setFilters] = useState<ReportsProviderState['filters']>([]);
  const [conditions, setConditions] = useState<ReportsProviderState['conditions']>([]);

  const { data: fetchedColumns = [], isFetching: fetchingColumns } = useQuery({
    queryFn: () => services.getColumns({ tableId }),
    select: (data) => data.data.columns.map<Column>((column) => ({
      column,
      heading: column.displayName,
      operation: undefined
    })),
    enabled: !!tableId,
    queryKey: ['columns', 'getAll', tableId]
  });

  const availableColumns = useMemo(() => {
    const selectedIds = new Set(columns.map((col) => col.column?.name));
    return fetchedColumns.filter((col) => !selectedIds.has(col.column?.name));
  }, [fetchedColumns, columns]);

  const addColumn: ReportsProviderState['addColumn'] = useCallback((id) => {
    const entity = availableColumns.find((col) => col.column?.name === id);
    if (!entity) return;
    setColumns((prev) => [...prev, entity]);
  }, [availableColumns]);

  const removeColumn: ReportsProviderState['removeColumn'] = useCallback((id) => {
    setColumns((prev) => prev.filter((col) => col.column?.name !== id));
    setGroupBy((prev) => prev.filter((col) => col.column?.name !== id));
  }, []);

  const updateColumn: ReportsProviderState['updateColumn'] = useCallback((id, update) => {
    setColumns((prev) => prev.map(
      (col) => (col.column?.name === id ? { ...col, ...update } : col)
    ));
  }, []);

  const addCondition: ReportsProviderState['addCondition'] = useCallback(() => {
    const newCondition: Condition = {
      column: undefined,
      operator: undefined,
      params: undefined,
      join: undefined
    };
    setConditions((prev) => [...prev, newCondition]);
  }, []);

  const removeCondition: ReportsProviderState['removeCondition'] = useCallback((id) => {
    setConditions((prev) => prev.filter((cond) => cond.column?.name !== id));
  }, []);

  const updateCondition: ReportsProviderState['updateCondition'] = useCallback((id, update) => {
    // @ts-ignore
    setConditions((prev) => prev.map(
      (cond) => (cond.column?.name === id ? { ...cond, ...update } : cond)
    ));
  }, []);

  const addFilter: ReportsProviderState['addFilter'] = useCallback(() => {
    const newFilter: Filter = {
      column: undefined,
      filterType: undefined
    };
    setFilters((prev) => [...prev, newFilter]);
  }, []);

  const removeFilter: ReportsProviderState['removeFilter'] = useCallback((id) => {
    setFilters((prev) => prev.filter((filter) => filter.column?.name !== id));
  }, []);

  const updateFilter: ReportsProviderState['updateFilter'] = useCallback((id, update) => {
    setFilters((prev) => prev.map(
      (filter) => (filter.column?.name === id ? { ...filter, ...update } : filter)
    ));
  }, []);

  const contextValue = useMemo(() => ({
    fetchingColumns,
    columns,
    availableColumns,
    addColumn,
    removeColumn,
    updateColumn,
    conditions,
    addCondition,
    removeCondition,
    updateCondition,
    filters,
    addFilter,
    removeFilter,
    updateFilter,
    groupBy,
    setGroupBy
  }), [
    fetchingColumns,
    columns,
    availableColumns,
    addColumn,
    removeColumn,
    updateColumn,
    conditions,
    addCondition,
    removeCondition,
    updateCondition,
    filters,
    addFilter,
    removeFilter,
    updateFilter,
    groupBy,
    setGroupBy
  ]);

  return <ReportsContext.Provider value={contextValue}>{children}</ReportsContext.Provider>;
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};
