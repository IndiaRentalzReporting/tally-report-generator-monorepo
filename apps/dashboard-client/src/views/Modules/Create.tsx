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
import { services } from '@/services/module';
import Fields from './Fields';
import { State, formSchema, defaultValues } from './interface';

const CreateModule: React.FC = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const queryClient = useQueryClient();
  const { mutateAsync: createModule, isPending: loadingCreateModule } = useMutation({
    mutationFn: (moduleDetails: Omit<State, 'id'>) => services.createOne({ moduleDetails }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', 'getAll'] });
    }
  });

  const handleSubmit = async (values: State) => {
    createModule(values);
    form.reset();
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
