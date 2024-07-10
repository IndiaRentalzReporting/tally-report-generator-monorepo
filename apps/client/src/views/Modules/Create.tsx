import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui';
import { services } from './services';
import Fields from './Fields';
import { State, initialState } from './interface';

const CreateModule: React.FC = () => {
  const [moduleDetails, setModuleDetails] = React.useState<State>(initialState);

  const queryClient = useQueryClient();
  const { mutateAsync: createModule, isPending: loadingCreateModule } =
    useMutation({
      mutationFn: () => services.createOne(moduleDetails),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['modules', 'getAll'] });
        setModuleDetails(initialState);
      }
    });

  const handleCreateModule: React.FormEventHandler = (e) => {
    e.preventDefault();
    createModule();
  };

  return (
    <form onSubmit={handleCreateModule} className="flex flex-col gap-4 h-full">
      <Fields moduleData={moduleDetails} setModuleData={setModuleDetails} />
      <Button
        type="submit"
        className="w-full mt-auto"
        isLoading={loadingCreateModule}
      >
        Create Module
      </Button>
    </form>
  );
};

export default CreateModule;
