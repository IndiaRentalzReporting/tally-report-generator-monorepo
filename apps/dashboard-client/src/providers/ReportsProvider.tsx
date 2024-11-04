import React, {
  useContext, useMemo, useCallback, useState,
  createContext
} from 'react';
import {
  UseMutateAsyncFunction, useMutation, useQuery, useQueryClient
} from '@tanstack/react-query';
import {
  DetailedColumnSelect,
  GeneratedReportFilters,
  ReportSelect
} from '@trg_package/schemas-reporting/types';
import { AxiosResponse } from 'axios';
import {
  services as columnService, getReportData, getReportColumns, getReportFilters
} from '@/services/Columns';
import { services as reportService } from '@/services/Reports';

export type Column = ReportSelect['columns'][number];
export type Condition = ReportSelect['conditions'][number];
export type Filter = ReportSelect['filters'][number];
export type GroupBy = ReportSelect['groupBy'][number];

interface ReportsProviderState {
  fetchedColumns: Array<Column>;
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

  groupBy: Array<GroupBy>;
  setGroupBy: React.Dispatch<React.SetStateAction<Array<GroupBy>>>;

  fetchingColumns: boolean,
  updateReport: UseMutateAsyncFunction<AxiosResponse<{
    report: ReportSelect;
  }>, Error>
  isUpdatingReport: boolean

  fetchData: UseMutateAsyncFunction<AxiosResponse<{
    data: unknown[];
  }, any>, Error, void, unknown>,
  fetchColumns: UseMutateAsyncFunction<AxiosResponse<Array<Pick<NonNullable<ReportSelect['queryConfig']>, 'columns'>>>>,
  fetchFilters: UseMutateAsyncFunction<AxiosResponse<{
    filters: GeneratedReportFilters[];
  }, any>, Error, void, unknown>,
}

const ReportsContext = createContext<ReportsProviderState | undefined>(undefined);

interface ReportsProviderProps {
  children: React.ReactNode;
  report: ReportSelect
}

const dummyColumn: DetailedColumnSelect = {
  id: '',
  displayName: '',
  table: '',
  type: 'string',
  heading: '',
  tablealias: '',
  name: '',
  alias: ''
};

const isDummyColumn = (column: DetailedColumnSelect) => JSON.stringify(column)
=== JSON.stringify(dummyColumn);

export const ReportsProvider: React.FC<ReportsProviderProps> = ({
  children, report
}) => {
  const [columns, setColumns] = useState<ReportsProviderState['columns']>(report.columns);
  const [groupBy, setGroupBy] = useState<ReportsProviderState['groupBy']>(report.groupBy);
  const [filters, setFilters] = useState<ReportsProviderState['filters']>(report.filters);
  const [conditions, setConditions] = useState<ReportsProviderState['conditions']>(report.conditions);

  const { data: fetchedColumns = [], isFetching: fetchingColumns } = useQuery({
    queryFn: () => columnService.read({ tableId: report.baseEntity }),
    select: (data) => data.data.columns.map<Column>((column) => ({
      column,
      heading: column.heading,
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

      return reportService.updateOne({ id: report.id }, {
        conditions: conditions.filter(
          (condition) => !isDummyColumn(condition.column)
        ),
        filters: filters.filter(
          (filter) => !isDummyColumn(filter.column)
        ),
        groupBy,
        columns,
        tables,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports', 'getOne', report.id] })
  });

  const { mutateAsync: fetchData } = useMutation({
    mutationFn: () => getReportData(report.id)
  });

  const { mutateAsync: fetchColumns } = useMutation({
    mutationFn: () => getReportColumns(report.id)
  });

  const { mutateAsync: fetchFilters } = useMutation({
    mutationFn: () => getReportFilters(report.id)
  });

  const availableColumns = useMemo(() => {
    const selectedIds = new Set(columns.map((col) => col.column.id));
    return fetchedColumns.filter((col) => !selectedIds.has(col.column.id));
  }, [fetchedColumns, columns]);

  const addColumn: ReportsProviderState['addColumn'] = useCallback((id) => {
    const entity = availableColumns.find((col) => col.column.id === id);
    if (!entity) return;
    setColumns((prev) => [...prev, entity]);
  }, [availableColumns]);

  const removeColumn: ReportsProviderState['removeColumn'] = useCallback((id) => {
    setColumns((prev) => prev.filter((col) => col.column.id !== id));
    setGroupBy((prev) => prev.filter((col) => col.column.id !== id));
  }, []);

  const updateColumn: ReportsProviderState['updateColumn'] = useCallback((id, update) => {
    setColumns((prev) => prev.map(
      (col) => (col.column.id === id ? { ...col, ...update } : col)
    ));
  }, []);

  const addCondition: ReportsProviderState['addCondition'] = useCallback(() => {
    const hasDummyCondition = conditions.some((condition) => isDummyColumn(condition.column));

    if (hasDummyCondition || conditions.length === fetchedColumns.length) return;

    const newCondition: Condition = {
      column: dummyColumn,
      operator: undefined,
      params: undefined,
      join: undefined
    };
    setConditions((prev) => [...prev, newCondition]);
  }, [conditions, fetchedColumns]);

  const removeCondition: ReportsProviderState['removeCondition'] = useCallback((id) => {
    setConditions((prev) => prev.filter((cond) => cond.column.id !== id));
  }, []);

  const updateCondition: ReportsProviderState['updateCondition'] = useCallback((id, _, update) => {
    setConditions((prev) => prev.map(
      (cond) => (cond.column.id === id ? { ...cond, ...update } : cond)
    ));
  }, []);

  const addFilter: ReportsProviderState['addFilter'] = useCallback(() => {
    const hasDummyFilter = filters.some((filter) => isDummyColumn(filter.column));

    if (hasDummyFilter || filters.length === fetchedColumns.length) return;

    const newFilter: Filter = {
      column: dummyColumn,
      filterType: 'default',
      conditionType: undefined
    };
    setFilters((prev) => [...prev, newFilter]);
  }, [filters, fetchedColumns]);

  const removeFilter: ReportsProviderState['removeFilter'] = useCallback((id) => {
    setFilters((prev) => prev.filter((filter) => filter.column.id !== id));
  }, []);

  const updateFilter: ReportsProviderState['updateFilter'] = useCallback((id, update) => {
    setFilters((prev) => prev.map(
      (filter) => (filter.column.id === id ? { ...filter, ...update } : filter)
    ));
  }, []);

  const contextValue = useMemo(() => ({
    fetchingColumns,
    fetchedColumns,
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
    isUpdatingReport,
    fetchColumns,
    fetchData,
    fetchFilters
  }), [
    fetchedColumns,
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
    isUpdatingReport,
    fetchColumns,
    fetchData,
    fetchFilters
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
