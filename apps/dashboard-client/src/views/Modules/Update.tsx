import React, {
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useEffect
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Skeleton } from '@trg_package/components';
import Fields from './Fields';
import { services } from '@/services/module';
import { State, initialState } from './interface';

const Edit: React.FC<Pick<State, 'id'>> = ({ id }) => {
  const [moduleDetails, setModuleDetails] = React.useState<State>(initialState);
  const [dataChanged, setDataChanged] = React.useState<boolean>(false);

  const { data: moduleData, isFetching: loadingModule } = useQuery({
    queryFn: () => services.getOne(id),
    select: (data) => data.data.module,
    queryKey: ['getOne', 'modules', id]
  });

  useEffect(() => {
    if (!moduleData) return;
    setModuleDetails(moduleData);
  }, [moduleData]);

  const queryClient = useQueryClient();
  const { mutateAsync: updateModule, isPending: updatingModule } = useMutation({
    mutationFn: () => services.updateOne(id, moduleDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', 'getAll'] });
      setModuleDetails(initialState);
    }
  });

  const handleModuleDataChange: Dispatch<SetStateAction<State>> = (
    newState
  ) => {
    if (!dataChanged) setDataChanged(true);
    setModuleDetails(newState);
  };

  const handleUpdateModule: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    updateModule();
  };

  return (
    <form onSubmit={handleUpdateModule} className="flex flex-col gap-6">
      <Skeleton isLoading={loadingModule}>
        <Fields
          moduleData={moduleDetails}
          setModuleData={handleModuleDataChange}
        />
      </Skeleton>
      <Button disabled={!dataChanged} type="submit" isLoading={updatingModule}>
        Update Module
      </Button>
    </form>
  );
};

export default Edit;
