import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Button, Form, Skeleton } from '@trg_package/vite/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { services } from '@/services/reports';
import Fields from './Fields';
import { State, formSchema } from './interface';

const Update: React.FC<Pick<State, 'id'>> = ({ id }) => {
  const queryClient = useQueryClient();
  const { data: report, isFetching: loadingReport } = useQuery({
    queryFn: () => services.read({ id }),
    select: (data) => formSchema.parse(data.data.reports[0]),
    queryKey: ['reports', 'getOne', id]
  });

  if (!report) throw new Error('Report data is undefined');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: report
  });

  const { mutateAsync: updateReport, isPending: updatingReport } = useMutation({
    mutationFn: (reportData: Omit<State, 'id'>) => services.updateOne(id, reportData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'getAll'] });
    }
  });

  const handleSubmit = (values: State) => {
    updateReport(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form className="h-full flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <Skeleton isLoading={loadingReport}>
          <Fields form={form} />
        </Skeleton>
        <Button
          isLoading={updatingReport}
          type="submit"
          className="w-full mt-auto"
        >
          Update
        </Button>
      </form>
    </Form>
  );
};

export default Update;
