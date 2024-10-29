import React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form
} from '@trg_package/vite/components';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { services } from '@/services/Reports';
import Fields from './Fields';
import { State, formSchema } from './interface';

const Create: React.FC = () => {
  const navigate = useNavigate();
  const form = useForm<State>({
    resolver: zodResolver(formSchema.omit({ id: true }))
  });

  const queryClient = useQueryClient();
  const { mutateAsync: createReport, isPending: loadingCreateReport } = useMutation({
    mutationFn: (reportDetails: State) => services.createOne(reportDetails),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'getAll'] });
      form.reset();
      navigate(`/reports/${data.data.report.id}`);
    }
  });

  const handleSubmit = async (values: State) => {
    await createReport(values);
  };

  return (
    <Form {...form}>
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
          isLoading={loadingCreateReport}
          className="w-min"
        >
          Create Report
        </Button>
      </form>
    </Form>
  );
};

export default Create;
