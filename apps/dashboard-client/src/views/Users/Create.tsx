import React from 'react';
import { Button } from '@trg_package/vite/components';
import { useAuth } from '@trg_package/vite/providers';
import { useForm } from 'react-hook-form';
import { schema } from '@hookform/resolvers/ajv/src/__tests__/__fixtures__/data.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { State, defaultValues } from './interface';
import Fields from './Fields';

const Create: React.FC = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues
  });

  const {
    signUp: { mutation: signUp, isLoading }
  } = useAuth();

  const handleSubmit = async (values: State) => {
    signUp(values);
    form.reset();
  };

  return (
    <form className="h-full flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <Fields form={form} />
      <Button isLoading={isLoading} type="submit" className="w-full mt-auto">
        Create
      </Button>
    </form>
  );
};

export default Create;
