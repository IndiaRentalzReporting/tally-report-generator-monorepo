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
import { services as tableService } from '@/services/Tables';
import { StateAsProps } from './interface';

const Fields: React.FC<StateAsProps> = ({ form, disabledFields }) => {
  const { data: baseEntities, isFetching: fetchingTables } = useQuery({
    queryFn: async () => tableService.read(),
    select: (data) => data.data.tables,
    queryKey: ['tables', 'getAll']
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className='flex-grow'>
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
            <FormItem className='flex-grow'>
              <FormLabel>Base Entity</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  disabled={disabledFields?.baseEntity}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Base Entity"/>
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
  );
};

export default Fields;
