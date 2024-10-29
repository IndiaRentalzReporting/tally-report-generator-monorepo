import React from 'react';
import { Button, Form } from '@trg_package/vite/components';
import { useAuth } from '@trg_package/vite/providers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { State, formSchema } from './interface';
import Fields from './Fields';

const Create: React.FC = () => {
  const form = useForm<State>({
    resolver: zodResolver(formSchema.omit({ id: true, role: true })),
  });

  const {
    signUp: { mutation: signUp, isLoading }
  } = useAuth();

  const handleSubmit = async (values: State) => {
    signUp(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form className="h-full flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <Fields form={form} />
        <Button isLoading={isLoading} type="submit" className="w-full mt-auto">
          Create
        </Button>
      </form>
    </Form>
  );
};

export default Create;
