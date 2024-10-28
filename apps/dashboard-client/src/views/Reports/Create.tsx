import React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@trg_package/vite/components';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { services } from '@/services/report';
import Fields from './Fields';
import { State, formSchema, defaultValues } from './interface';

const Create: React.FC = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const queryClient = useQueryClient();
  const { mutateAsync: createReport, isPending: loadingCreateReport } = useMutation({
    mutationFn: (reportDetails: Omit<State, 'id'>) => services.createOne(reportDetails),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'getAll'] });
      navigate(`/reports/${data.data.report.id}`);
    }
  });

  const handleSubmit = async (values: State) => {
    createReport(values);
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
          <CardDescription>
            Give your report an appropriate details!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Fields form={form} />
        </CardContent>
      </Card>
      <Button
        type="submit"
        className="w-min"
        isLoading={loadingCreateReport}
      >
        Create Report
      </Button>
    </form>
  );
};

export default Create;
