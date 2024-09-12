import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@trg_package/components';
import { services } from './services';
import Fields from './Fields';
import { State, initialState } from './interface';
// import TableCreation, { IColumnDetails } from './TableCreation';

const CreateModule: React.FC = () => {
  const [moduleDetails, setModuleDetails] = React.useState<State>(initialState);
  // const [columnDetails, setColumnDetails] = React.useState<
  //   Array<IColumnDetails>
  // >([]);

  const queryClient = useQueryClient();
  const { mutateAsync: createModule, isPending: loadingCreateModule } =
    useMutation({
      mutationFn: () => services.createOne({ moduleDetails }),
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
    <form onSubmit={handleCreateModule} className="flex flex-col gap-6 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Modules Details</CardTitle>
          <CardDescription>
            Give your module an appropriate name and icon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Fields moduleData={moduleDetails} setModuleData={setModuleDetails} />
        </CardContent>
      </Card>
      {/*<Card>
        <CardHeader>
          <CardTitle>Column Details</CardTitle>
          <CardDescription>
            Define all the column your module would have!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableCreation
            columnDetails={columnDetails}
            setColumnDetails={setColumnDetails}
          />
        </CardContent>
      </Card>*/}
      <Button
        type="submit"
        isLoading={loadingCreateModule}
        disabled={!!moduleDetails}
      >
        Create Module
      </Button>
    </form>
  );
};

export default CreateModule;
