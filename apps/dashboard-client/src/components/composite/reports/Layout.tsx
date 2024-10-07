import Sidebar from './Sidebar';
import DashboardHeader from '../dashboard/DashboardHeader';
import DataTable from './Table';
import { ReportsProvider } from '@/providers/ReportsProvider';

const Layout = () => (
  <ReportsProvider>
    <div className="grid relative min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <DashboardHeader />
        <DataTable data={[]} />
      </div>
    </div>
  </ReportsProvider>
);

export default Layout;
