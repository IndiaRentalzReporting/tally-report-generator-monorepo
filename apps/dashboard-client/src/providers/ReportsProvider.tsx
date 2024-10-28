import React, {
  useContext, useMemo, useCallback, useState,
  createContext
} from 'react';
import {
  UseMutateAsyncFunction, useMutation, useQuery, useQueryClient
} from '@tanstack/react-query';
import {
  ReportSelect
} from '@trg_package/schemas-reporting/types';
import { AxiosResponse } from 'axios';
import { services } from '@/services/column';

export type Column = Partial<ReportSelect['columns'][number]>;
export type Condition = Partial<ReportSelect['conditions'][number]>;
export type Filter = Partial<ReportSelect['filters'][number]>;

interface ReportsProviderState {
  columns: Array<Column>;
  availableColumns: Array<Column>;
  addColumn: (id: string | undefined) => void;
  removeColumn: (id: string | undefined) => void;
  updateColumn: (id: string | undefined, update: Partial<Column>) => void;

  conditions: Array<Condition>;
  addCondition: () => void;
  removeCondition: (id: string | undefined) => void;
  updateCondition:
  <T extends Condition>(id: string | undefined, condition: T, update: Partial<T>) => void;

  filters: Array<Filter>;
  addFilter: () => void;
  removeFilter: (id: string | undefined) => void;
  updateFilter: (id: string | undefined, update: Partial<Filter>) => void;

  groupBy: Array<Column>;
  setGroupBy: React.Dispatch<React.SetStateAction<Array<Column>>>;

  fetchingColumns: boolean,

  updateReport: UseMutateAsyncFunction<AxiosResponse<{
    report: ReportSelect;
  }, any>, Error>
  isUpdatingReport: boolean
}

const ReportsContext = createContext<ReportsProviderState | undefined>(undefined);

interface ReportsProviderProps {
  children: React.ReactNode;
  report: ReportSelect
}

export const ReportsProvider: React.FC<ReportsProviderProps> = (
  {
    children, report
  }
) => {
  const [columns, setColumns] = useState<ReportsProviderState['columns']>(report.columns);
  const [groupBy, setGroupBy] = useState<ReportsProviderState['groupBy']>(report.groupBy);
  const [filters, setFilters] = useState<ReportsProviderState['filters']>(report.filters);
  const [conditions, setConditions] = useState<ReportsProviderState['conditions']>(report.conditions);

  const { data: fetchedColumns = [], isFetching: fetchingColumns } = useQuery({
    queryFn: () => services.read({ tableId: report.baseEntity }),
    select: (data) => data.data.columns.map<Column>((column) => ({
      column,
      heading: column.displayName,
      operation: undefined
    })),
    enabled: !!report.baseEntity,
    queryKey: ['columns', 'getAll', report.baseEntity]
  });

  const queryClient = useQueryClient();
  const { mutateAsync: updateReport, isPending: isUpdatingReport } = useMutation({
    mutationFn: () => {
      const tables = Array.from(new Set(columns
        .filter((column) => !!column.column && !!column.column.tablealias)
        .map((column) => column.column!.tablealias)));

      return services.updateOne(report.id, {
        conditions: conditions as ReportSelect['conditions'],
        filters: filters as ReportSelect['filters'],
        groupBy: groupBy as ReportSelect['groupBy'],
        columns: columns as ReportSelect['columns'],
        tables: tables as ReportSelect['tables'],
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports', 'getOne', report.id] })
  });

  const availableColumns = useMemo(() => {
    const selectedIds = new Set(columns.map((col) => col.column?.displayName));
    return fetchedColumns.filter((col) => !selectedIds.has(col.column?.displayName));
  }, [fetchedColumns, columns]);

  const addColumn: ReportsProviderState['addColumn'] = useCallback((id) => {
    const entity = availableColumns.find((col) => col.column?.id === id);
    if (!entity) return;
    setColumns((prev) => [...prev, entity]);
  }, [availableColumns]);

  const removeColumn: ReportsProviderState['removeColumn'] = useCallback((id) => {
    setColumns((prev) => prev.filter((col) => col.column?.id !== id));
    setGroupBy((prev) => prev.filter((col) => col.column?.id !== id));
  }, []);

  const updateColumn: ReportsProviderState['updateColumn'] = useCallback((id, update) => {
    setColumns((prev) => prev.map(
      (col) => (col.column?.id === id ? { ...col, ...update } : col)
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
    setConditions((prev) => prev.filter((cond) => cond.column?.id !== id));
  }, []);

  const updateCondition: ReportsProviderState['updateCondition'] = useCallback((id, condition, update) => {
    setConditions((prev) => prev.map(
      (cond) => (cond.column?.id === id ? { ...cond, ...update } : cond)
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
    setFilters((prev) => prev.filter((filter) => filter.column?.id !== id));
  }, []);

  const updateFilter: ReportsProviderState['updateFilter'] = useCallback((id, update) => {
    setFilters((prev) => prev.map(
      (filter) => (filter.column?.id === id ? { ...filter, ...update } : filter)
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
    setGroupBy,
    updateReport,
    isUpdatingReport
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
    setGroupBy,
    updateReport,
    isUpdatingReport
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
