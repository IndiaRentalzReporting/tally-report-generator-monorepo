import {
  UserTallyCompanyInsert,
  UserTallyCompanySelect
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/vite/client';
import { CrudServices } from '.';

const userTallyCompanysAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/user_tallyCompany',
    withCredentials: true
  }
);

export const services: CrudServices<
'userTallyCompany',
UserTallyCompanySelect,
UserTallyCompanyInsert,
UserTallyCompanySelect,
{ userId: string; tallyCompanyId: string }
> = {
  read: async (query) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return userTallyCompanysAxios.get(`/read?${queryString}`);
  },
  createOne: async (userTallyCompanyDetails) => userTallyCompanysAxios.post('/create', userTallyCompanyDetails),
  updateOne: async ({ userId, tallyCompanyId }, data) => userTallyCompanysAxios.patch(`/update/${userId}/${tallyCompanyId}`, data),
  deleteOne: async ({ userId, tallyCompanyId }) => userTallyCompanysAxios.delete(`/delete/${userId}/${tallyCompanyId}`)
};
