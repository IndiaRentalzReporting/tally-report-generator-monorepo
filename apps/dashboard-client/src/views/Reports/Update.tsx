import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Button, Skeleton } from '@trg_package/vite/components';
import { services } from '@/services/reports';
import Fields from './Fields';
import { State, initialState } from './interface';

const Update: React.FC<Pick<State, 'id'>> = ({ id }) => {
  console.log({ id });
  const [reportData, setReportData] = React.useState<State>(initialState);

  const queryClient = useQueryClient();
  const { data: report, isFetching: loadingReport } = useQuery({
    queryFn: () => services.read({ id }),
    select: (data) => data.data.reports[0],
    queryKey: ['reports', 'getOne', id]
  });

  useEffect(() => {
    if (!report) return;
    setReportData(report);
  }, [report]);

  const { mutateAsync: updateReport, isPending: updatingReport } = useMutation({
    mutationFn: () => services.updateOne(id, reportData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'getAll'] });
    },
    onSettled: () => {
      setReportData(initialState);
    }
  });

  const handleUpdateReport: React.FormEventHandler = (e) => {
    e.preventDefault();
    updateReport();
  };

  return (
    <form className="h-full flex flex-col gap-4" onSubmit={handleUpdateReport}>
      <Skeleton isLoading={loadingReport}>
        <Fields reportData={reportData} setReportData={setReportData} />
      </Skeleton>
      <Button
        isLoading={updatingReport}
        type="submit"
        className="w-full mt-auto"
      >
        Update
      </Button>
    </form>
  );
};

export default Update;
