import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
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

const Edit: React.FC = () => {
  const [moduleDetails, setModuleDetails] = React.useState<State>(initialState);
  const { id } = useParams<{ id: string }>();

  const { data: moduleData, isFetching: loadingReadModule } = useQuery({
    queryFn: () => services.module.readOne(id),
    select: (data) => data.data.module,
    queryKey: ['getOne', 'modules', id]
  });

  useEffect(() => {
    if (!moduleData) return;
    setModuleDetails(moduleData);
  }, [moduleData]);

  const queryClient = useQueryClient();
  const { mutateAsync: createModule, isPending: loadingUpdateModule } =
    useMutation({
      mutationFn: () => services.module.updateOne(id, moduleDetails),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['modules', 'getAll'] });
      },
      onSettled: () => {
        setModuleDetails(initialState);
      }
    });

  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Edit Module
        </CardTitle>
        <CardDescription>Edit details related to this Module</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex flex-col gap-4"
        >
          <Fields
            moduleDetails={moduleDetails}
            setModuleDetails={setModuleDetails}
          />
          <Button
            type="submit"
            className="w-min mt-2"
            isLoading={loadingUpdateModule}
          >
            Create Module
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Edit;
