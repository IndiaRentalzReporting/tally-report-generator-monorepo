import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form
} from '@trg_package/vite/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { services } from '@/services/Modules';
import Fields from './Fields';
import { InsertState, InsertFormSchema, FormState } from './interface';

const CreateModule: React.FC = () => {
  const form = useForm<FormState>({
    resolver: zodResolver(InsertFormSchema),
  });

  const queryClient = useQueryClient();
  const { mutateAsync: createModule, isPending: loadingCreateModule } = useMutation({
    mutationFn: (moduleDetails: Omit<InsertState, 'id'>) => services.createOne(moduleDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', 'getAll'] });
    }
  });

  const handleSubmit = async (values: FormState) => {
    createModule(values);
    form.resetField('name', { defaultValue: '' });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Modules Details</CardTitle>
            <CardDescription>
              Give your module an appropriate name and icon!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Fields form={form} />
          </CardContent>
        </Card>
        <Button
          type="submit"
          isLoading={loadingCreateModule}
        >
          Create Module
        </Button>
      </form>
    </Form>
  );
};

export default CreateModule;
