import React, { useState } from 'react';
import {
  PaginationState
} from '@tanstack/react-table';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Skeleton
} from '@trg_package/vite/components';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { RuntimeFilters } from '@trg_package/schemas-reporting/types';
import { useReports } from '@/providers/ReportsProvider';
import { createReadReportColumn } from './columns';
import Filters from '@/components/composite/reports/Filters';
import { getReportData, getReportColumns, getReportFilters } from '@/services/Reports';

const Read: React.FC = () => {
  const { report } = useReports();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: reportColumns = [] } = useQuery({
    queryFn: () => getReportColumns(report.id),
    queryKey: ['Reports', 'Columns', report.id],
    select: (data) => data.data.columns.map((column) => createReadReportColumn(column)),
  });

  const { data: reportFilters = [] } = useQuery({
    queryFn: () => getReportFilters(report.id),
    queryKey: ['Reports', 'Filters', report.id],
    select: (data) => data.data.filters,
  });

  const [filtersState, setFiltersState] = useState<RuntimeFilters>({});

  const {
    data: reportData = {
      data: [],
      totalCount: 0
    },
    isLoading: loadingReportData,
    isFetching: fetchingReportData,
  } = useQuery({
    queryFn: () => getReportData(report.id, pagination, filtersState),
    queryKey: ['Reports', 'Data', report.id, pagination, filtersState],
    select: (data) => data.data,
    enabled: !!reportColumns
  });

  return (
    <Card>
      <CardHeader>
        <div className='flex items-start gap-4'>
          <div className='space-y-1.5 mr-auto'>
            <CardTitle className='flex justify-between items-center'>
              { report.name } Report
            </CardTitle>
            <CardDescription>
              Add filters to narrow down the report!
            </CardDescription>
          </div>
          <Link to={`/dashboard/Reports/Update/${report.id}`}>
            <Button variant="destructive" className='flex gap-2 items-center w-min ml-auto'>
                <ExternalLink size={20} />
                <span className='text-sm'>Edit</span>
            </Button>
          </Link>
          <Filters
            reportFilters={reportFilters}
            isFetchingReport={fetchingReportData}
            filtersState={filtersState}
            setFiltersState={setFiltersState}
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 relative">
        <Skeleton isLoading={loadingReportData}>
          <DataTable
            columns={reportColumns}
            data={reportData.data}
            enablePagination
            pagination={{
              totalCount: reportData.totalCount,
              paginationState: pagination,
              onPaginationChange: setPagination
            }}
            enableSorting
          />
          <div className='flex items-center gap-2 absolute bottom-6 left-6'>
            <Label className='w-max' htmlFor="pagination-size">Row Count</Label>
            <Select
              value={String(pagination.pageSize)}
              onValueChange={
                (value) => setPagination({
                  ...pagination,
                  pageSize: Number(value)
                })
              }
            >
              <SelectTrigger className='w-20'>
                <SelectValue placeholder="Row Count" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Row Count</SelectLabel>
                  {['10', '20', '30', '40', '50', '100'].map((count) => (
                    <SelectItem key={count} value={count}>
                      {count}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </Skeleton>
      </CardContent>
    </Card>
  );
};

export default Read;
