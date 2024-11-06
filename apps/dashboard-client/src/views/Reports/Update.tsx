/* eslint-disable no-nested-ternary */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import {
  Button, Form, Skeleton, Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@trg_package/vite/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services } from '@/services/Reports';
import Fields from './Fields';
import { FormState, SelectFormSchema, SelectState } from './interface';
import DataTable from '@/components/composite/reports/Table';
import { useReports } from '@/providers/ReportsProvider';
import Conditions from '@/components/composite/reports/Conditions';
import Filters from '@/components/composite/reports/Filters';
import GroupBy from '@/components/composite/reports/GroupBy';

const Update: React.FC<Pick<SelectState, 'id'>> = ({ id }) => {
  const queryClient = useQueryClient();
  const { data: reportData, isFetching: loadingReport } = useQuery({
    queryFn: () => services.read({ id }),
    select: (data) => SelectFormSchema.parse(data.data.reports[0]),
    queryKey: ['reports', 'getOne', id]
  });

  const form = useForm<FormState>({
    resolver: zodResolver(SelectFormSchema),
    values: reportData
  });

  const { mutateAsync: updateReport, isPending: updatingReport } = useMutation({
    mutationFn: (reportUpdate: FormState) => services.updateOne({ id }, reportUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'getAll'] });
    }
  });

  const handleSubmit = async (values: FormState) => {
    const { data: { report } } = await updateReport(values);
    form.resetField('name', { defaultValue: report.name });
    form.resetField('description', { defaultValue: report.description });
    form.resetField('baseEntity', { defaultValue: report.baseEntity });
  };

  return (
    isReportRoute
      ? <UpdateReport/>
      : <Form {...form}>
          <form className="h-full flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <Skeleton isLoading={loadingReport}>
              <Fields
                form={form}
                disabledFields={{
                  baseEntity: true
                }}
              />
              <Link to={`/dashboard/reports/update?id=${reportData?.id}`} className='flex items-center gap-2 self-end'>
                <span className='text-sm'>Edit</span>
                <ExternalLink size={20} />
              </Link>
            </Skeleton>
            <div className='flex items-center gap-2 justify-between'>
              <Button
                isLoading={updatingReport}
                type="submit"
                className="mt-auto"
              >
                Update
              </Button>
            </div>
          </form>
        </Form>
  );
};

export default Update;

const UpdateReport: React.FC = () => {
  const { updateReport, isUpdatingReport } = useReports();
  return (
    <main className="flex flex-col space-y-6">
      <DataTable data={[{}]} />
      <Card>
        <CardHeader>
          <CardTitle>Report Settings</CardTitle>
          <CardDescription />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <GroupBy />
            <Conditions />
            <Filters />
          </div>
        </CardContent>
      </Card>
      <Button className='w-min' onClick={() => updateReport()} isLoading={isUpdatingReport}>Update Report</Button>
    </main>
  );
};
