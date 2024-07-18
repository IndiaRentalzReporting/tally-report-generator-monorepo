import React, { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnType } from '@fullstack_package/interfaces';
import { ColumnDef } from '@tanstack/react-table';
import { table } from 'console';
import { Button, CardContent } from '@/components/ui';
import { services } from './services';
import Fields from './Fields';
import { State, initialState } from './interface';
import TableCreation, { IColumnDetails } from './TableCreation';
import { DataTable } from '@/components/composite';

const CreateModule: React.FC = () => {
  const [moduleDetails, setModuleDetails] = React.useState<State>(initialState);
  const [columnDetails, setColumnDetails] = React.useState<
    Array<IColumnDetails>
  >([]);

  const queryClient = useQueryClient();
  const { mutateAsync: createModule, isPending: loadingCreateModule } =
    useMutation({
      mutationFn: () => services.createOne({ moduleDetails, columnDetails }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['modules', 'getAll'] });
        setModuleDetails(initialState);
      }
    });

  const handleCreateModule: React.FormEventHandler = (e) => {
    e.preventDefault();
    createModule();
  };

  interface ColumnData {
    [key: string]: string;
  }

  // Use useMemo to optimize performance
  const tableData: ColumnData[] = useMemo(
    () => [
      columnDetails.reduce(
        (agg, column) => ({
          ...agg,
          [column.name]:
            ColumnType[column.type as keyof typeof ColumnType]?.example ||
            'No example available'
        }),
        {} as ColumnData
      )
    ],
    [columnDetails]
  );

  const tableColumn: ColumnDef<ColumnData>[] = useMemo(
    () =>
      columnDetails.map((column) => ({
        header: column.name,
        accessorKey: column.name,
        cell: ({ cell }) => (
          <p className="text-muted-foreground">{cell.getValue() as string}</p>
        )
      })),
    [columnDetails]
  );

  return (
    <form onSubmit={handleCreateModule} className="flex flex-col gap-4 h-full">
      <Fields moduleData={moduleDetails} setModuleData={setModuleDetails} />
      <TableCreation
        columnDetails={columnDetails}
        setColumnDetails={setColumnDetails}
      />
      <DataTable columns={tableColumn} data={tableData} />
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
