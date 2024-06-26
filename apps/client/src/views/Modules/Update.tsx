import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Module } from '@/models';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button
} from '@/components/ui';
import Fields from './Fields';
import services from '@/services';

type State = Pick<Module, 'name' | 'isPrivate' | 'icon'>;

const initialState: State = {
  name: '',
  isPrivate: false,
  icon: ''
};

const Edit: React.FC<{ id: string }> = ({ id }) => {
  const [moduleDetails, setModuleDetails] = React.useState<State>(initialState);

  const { data: moduleData, isFetching: loadingReadModule } = useQuery({
    queryFn: () => services.Modules.getOne(id),
    select: (data) => data.data.module,
    queryKey: ['getOne', 'modules', id]
  });

  useEffect(() => {
    if (!moduleData) return;
    setModuleDetails(moduleData);
  }, [moduleData]);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync: updateModule, isPending: loadingUpdateModule } =
    useMutation({
      mutationFn: () => services.Modules.updateOne(id, moduleDetails),
      onSuccess: () => {
        navigate('/dashboard/Modules');
        queryClient.invalidateQueries({ queryKey: ['modules', 'getAll'] });
      },
      onSettled: () => {
        setModuleDetails(initialState);
      }
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateModule();
      }}
      className="flex flex-col gap-6"
    >
      <Fields
        moduleDetails={moduleDetails}
        setModuleDetails={setModuleDetails}
      />
      <Button type="submit" isLoading={loadingUpdateModule}>
        Update Module
      </Button>
    </form>
  );
};

export default Edit;
