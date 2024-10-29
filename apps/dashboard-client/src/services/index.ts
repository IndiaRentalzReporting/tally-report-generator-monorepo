import { AxiosPromise } from 'axios';

export type CrudServices<
  T extends string,
  TSelect extends object,
  TInsert extends object,
  TReturn extends object = TSelect,
  TID extends object = { id: string },
> = {
  read: (query?: Partial<TSelect>) => AxiosPromise<{ [key in `${T}s`]: TReturn[] }>;
  createOne: (data: TInsert) => AxiosPromise<{ [key in T]: TSelect }>;
  updateOne: (
    identifiers: TID,
    data: Partial<TSelect>
  ) => AxiosPromise<{ [key in T]: TSelect }>;
  deleteOne: (
    identifiers: TID
  ) => AxiosPromise<{ [key in T]: TSelect }>;
};
