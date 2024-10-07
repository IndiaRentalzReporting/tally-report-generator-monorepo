import React, { useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@trg_package/vite/components';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { services } from '@/services/reports';
import Fields from './Fields';
import { State, initialState } from './interface';

const Create: React.FC = () => {
  const navigate = useNavigate();
  const [reportDetails, setReportDetails] = React.useState<State>(initialState);

  const queryClient = useQueryClient();
  const { mutateAsync: createReport, isPending: loadingCreateReport } =
    useMutation({
      mutationFn: () => services.createOne(reportDetails),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['reports', 'getAll'] });
        setReportDetails(initialState);
        navigate(`/reports/${data.data.report.id}`);
      }
    });

  const handleCreateReport: React.FormEventHandler = (e) => {
    e.preventDefault();
    createReport();
  };

  useEffect(() => {
    console.log({
      reportDetails
    });
  }, [reportDetails]);

  return (
    <form onSubmit={handleCreateReport} className="flex flex-col gap-6 h-full">
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
        isLoading={loadingCreateReport}
        disabled={!reportDetails}
      >
        Create Report
      </Button>
    </form>
  );
};

export default Create;
