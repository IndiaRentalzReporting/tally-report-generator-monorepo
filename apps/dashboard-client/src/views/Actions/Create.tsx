import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Button } from '@trg_package/components';
import { services } from '@/services/action';
import Fields from './Fields';
import { State, initialState } from './interface';

const Create: React.FC = () => {
  const [actionData, setActionData] = React.useState<State>(initialState);

  const queryClient = useQueryClient();
  const { mutateAsync: createAction, isPending: loadingCreateAction } =
    useMutation({
      mutationFn: () => services.createOne(actionData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['actions', 'getAll'] });
        queryClient.invalidateQueries({ queryKey: ['permissions', 'getAll'] });
      },
      onSettled: () => {
        setActionData(initialState);
      }
    });

  const handleCreateAction: React.FormEventHandler = (e) => {
    e.preventDefault();
    createAction();
  };

  return (
    <form className="h-full flex flex-col gap-4" onSubmit={handleCreateAction}>
      <Fields actionData={actionData} setActionData={setActionData} />
      <Button
        type="submit"
        isLoading={loadingCreateAction}
        className="w-full mt-auto"
      >
        Create
      </Button>
    </form>
  );
};

export default Create;
