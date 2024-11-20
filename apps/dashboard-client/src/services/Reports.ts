import {
  GeneratedReportColumns,
  GeneratedReportData,
  GeneratedReportFilters,
  ReportInsert,
  ReportSelect,
  RuntimeFilters,
  ScheduleInsert
} from '@trg_package/schemas-reporting/types';
import createAxiosClient from '@trg_package/vite/client';
import { AxiosPromise } from 'axios';
import { UserSelect } from '@trg_package/schemas-dashboard/types';
import { CrudServices } from '.';

const reportsAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/reports',
    withCredentials: true
  }
);

export const services: CrudServices<
'report',
ReportSelect,
ReportInsert
> = {
  read: async (query) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return reportsAxios.get(`/read?${queryString}`);
  },
  createOne: async (data) => reportsAxios.post('/create', data),
  updateOne: async ({ id }, data) => reportsAxios.patch(`/update/${id}`, data),
  deleteOne: async ({ id }) => reportsAxios.delete(`/delete/${id}`),
};

export const getReportColumns = async (reportId: string): AxiosPromise<{
  columns: Array<GeneratedReportColumns>
}> => reportsAxios.get(`/read/reportColumns/${reportId}`);

export const getReportData = async (
  reportId: string,
  {
    pageSize,
    pageIndex,
  }:{
    pageSize: number,
    pageIndex: number,
  },
  filters?: RuntimeFilters
): AxiosPromise<{
  data: Array<GeneratedReportData>,
  totalCount: number
}> => {
  const params = new URLSearchParams({
    pageSize: pageSize.toString(),
    pageIndex: pageIndex.toString(),
  });

  if (filters) {
    params.append('filters', JSON.stringify(filters));
  }

  return reportsAxios.get(`/read/reportData/${reportId}`, { params });
};

export const getReportFilters = async (reportId: string): AxiosPromise<{
  filters : Array<GeneratedReportFilters>
}> => reportsAxios.get(`/read/reportFilters/${reportId}`);

export const updateAccess = async (
  reportId: ReportSelect['id'],
  data: {
    users: Array<UserSelect['id']>
  }
): AxiosPromise => reportsAxios.patch(`/update/access/${reportId}`, data);

export const updateSchedule = async (
  reportId: ReportSelect['id'],
  data: {
    schedule: Omit<ScheduleInsert, 'reportId' | 'nextRun'>
    users: Array<UserSelect['id']>
  }
): AxiosPromise => reportsAxios.patch(`/update/schedule/${reportId}`, data);
