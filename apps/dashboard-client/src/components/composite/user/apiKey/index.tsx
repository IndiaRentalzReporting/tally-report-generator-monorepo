'use client';

import {
  DialogContent, DialogDescription, DialogHeader, DialogTitle,
  Button, Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  DataTable,
  Skeleton
} from '@trg_package/vite/components';
import { PlusIcon } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { services } from '@/services/ApiKey';
import { columns } from './columns';
import { InsertState, InsertFormSchema } from './interface';

const ApiKeys = () => {
  const { data: apiKeys = [], isFetching: loadingApiKeys } = useQuery({
    queryFn: () => services.read(),
    select: (data) => data.data.apiKeys,
    queryKey: ['apiKeys', 'read'],
  });

  const queryClient = useQueryClient();
  const form = useForm<InsertState>({
    resolver: zodResolver(InsertFormSchema),
  });

  const { mutateAsync: createApiKey, isPending: creatingApiKey } = useMutation({
    mutationFn: (data: InsertState) => services.createOne({
      ...data,
      key: 'temporary key'
    }),
    mutationKey: ['apiKeys', 'create'],
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apiKeys', 'read'] })
  });

  const handleSubmit = (values: InsertState) => {
    createApiKey(values);
    form.reset();
  };

  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>API Keys</DialogTitle>
        <DialogDescription>
          View and manage your API keys. Keep these secret and secure.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <Skeleton isLoading={loadingApiKeys}>
          <DataTable
            data={apiKeys}
            columns={columns}
          />
        </Skeleton>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex items-start gap-2 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder="API Key Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              isLoading={creatingApiKey}
            >
              <PlusIcon className='mr-2'/>
              Create
            </Button>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
};

export default ApiKeys;
