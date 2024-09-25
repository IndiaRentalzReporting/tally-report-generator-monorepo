import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { services } from '@/services/action';
import Fields from './Fields';
import { Button, Skeleton } from '@trg_package/components';
import { State, initialState } from './interface';

const Update: React.FC<Pick<State, 'id'>> = ({ id }) => {
  const [actionData, setActionData] = React.useState<State>(initialState);

  const queryClient = useQueryClient();
  const { data: actionDataX, isFetching: loadingAction } = useQuery({
    queryFn: () => services.getOne(id),
    select: (data) => data.data.action,
    queryKey: ['actions', 'getOne', id]
  });

  useEffect(() => {
    if (!actionDataX) return;
    setActionData(actionDataX);
  }, [actionDataX]);

  const { mutateAsync: updateAction, isPending: updatingAction } = useMutation({
    mutationFn: () => services.updateOne(id, actionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions', 'getAll'] });
      queryClient.invalidateQueries({ queryKey: ['permissions', 'getAll'] });
    },
    onSettled: () => {
      setActionData(initialState);
    }
  });

  const handleUpdateAction: React.FormEventHandler = (e) => {
    e.preventDefault();
    updateAction();
  };

  return (
    <form className="h-full flex flex-col gap-4" onSubmit={handleUpdateAction}>
      <Skeleton isLoading={loadingAction}>
        <Fields actionData={actionData} setActionData={setActionData} />
      </Skeleton>
      <Button
        isLoading={updatingAction}
        type="submit"
        className="w-full mt-auto"
      >
        Update
      </Button>
    </form>
  );
};

export default Update;
