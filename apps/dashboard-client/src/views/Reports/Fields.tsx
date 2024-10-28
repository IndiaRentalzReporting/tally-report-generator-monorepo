import React from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Skeleton
} from '@trg_package/vite/components';
import { useQuery } from '@tanstack/react-query';
import { StateAsProps } from './interface';
import { services as tableService } from '@/services/table';

const Fields: React.FC<StateAsProps> = ({ form }) => {
  const { data: baseEntities, isFetching: fetchingTables } = useQuery({
    queryFn: async () => tableService.read(),
    select: (data) => data.data.tables,
    queryKey: ['roles', 'getAll']
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel >Name</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder="Report Name"
                  {...field}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="baseEntity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Entity</FormLabel>
              <FormControl>
                <Select
                  {...field}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Base Entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tables</SelectLabel>
                      <Skeleton isLoading={fetchingTables}>
                        {baseEntities?.map((table) => (
                          <SelectItem key={table.id} value={table.id}>
                            {table.displayName}
                          </SelectItem>
                        ))}
                      </Skeleton>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-4 items-center">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel >Description</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder="Description"
                  {...field}
                  value={field.value ?? undefined}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default Fields;
