import { AxiosPromise } from 'axios';
import {
  UserTallyCompanyInsert,
  UserTallyCompanySelect
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/axios-client';

const userTallyCompanysAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/permission_actions',
    withCredentials: true
  }
);

export const services = {
  read: async (
    query: Partial<UserTallyCompanySelect> = {}
  ): AxiosPromise<{
    userTallyCompanys: UserTallyCompanySelect[];
  }> => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return userTallyCompanysAxios.get(`/read?${queryString}`);
  },
  createOne: async (
    userTallyCompanyDetails: UserTallyCompanyInsert
  ): AxiosPromise<{ userTallyCompany: UserTallyCompanySelect }> => userTallyCompanysAxios.post('/create', userTallyCompanyDetails),
  updateOne: async (
    {
      user_id,
      tallyCompany_id
    }: {
      user_id: UserTallyCompanySelect['user_id'];
      tallyCompany_id: UserTallyCompanySelect['tallyCompany_id'];
    },
    data: Partial<UserTallyCompanySelect>
  ): AxiosPromise<UserTallyCompanySelect> => userTallyCompanysAxios.patch(`/update/${user_id}/${tallyCompany_id}`, data),
  deleteOne: async ({
    user_id,
    tallyCompany_id
  }: {
    user_id: UserTallyCompanySelect['user_id'];
    tallyCompany_id: UserTallyCompanySelect['tallyCompany_id'];
  }): AxiosPromise<{ userTallyCompany: UserTallyCompanySelect }> => userTallyCompanysAxios.delete(`/delete/${user_id}/${tallyCompany_id}`)
};
