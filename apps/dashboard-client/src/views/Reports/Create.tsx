import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@trg_package/vite/components';
import { useNavigate } from 'react-router';
import { services } from '@/services/reports';
import Fields from './Fields';
import { State, initialState } from './interface';

const Create: React.FC = () => {
  const navigate = useNavigate();
  const [reportDetails, setReportDetails] = React.useState<State>(initialState);

  const queryClient = useQueryClient();
  const { mutateAsync: createModule, isPending: loadingCreateModule } =
    useMutation({
      mutationFn: () => services.createOne(reportDetails),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['reports', 'getAll'] });
        setReportDetails(initialState);
        navigate(`/reports/${data.data.report.id}`);
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
          <CardTitle>Report Details</CardTitle>
          <CardDescription>
            Give your report an appropriate details!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Fields reportData={reportDetails} setReportData={setReportDetails} />
        </CardContent>
      </Card>
      <Button
        type="submit"
        className="w-min"
        isLoading={loadingCreateModule}
        disabled={!reportDetails}
      >
        Create Module
      </Button>
    </form>
  );
};

export default Create;
