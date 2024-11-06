import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button
} from '@trg_package/vite/components';
import Conditions from '@/components/composite/reports/Conditions';
import Filters from '@/components/composite/reports/Filters';
import GroupBy from '@/components/composite/reports/GroupBy';
import Table from '@/components/composite/reports/Table';
import { useReports } from '@/providers/ReportsProvider';

const UpdateReport: React.FC = () => {
  const { updateReport, isUpdatingReport } = useReports();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Report</CardTitle>
        <CardDescription>
          Update the existing report with the new settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 space-y-6">
        <Table data={[{}]} />
        <Card>
          <CardHeader>
            <CardTitle>Report Settings</CardTitle>
            <CardDescription />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <GroupBy />
              <Conditions />
              <Filters />
            </div>
          </CardContent>
        </Card>
        <Button className='w-min' onClick={() => updateReport()} isLoading={isUpdatingReport}>Update Report</Button>
      </CardContent>
    </Card>
  );
};

export default UpdateReport;
