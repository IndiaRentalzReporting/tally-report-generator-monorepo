'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader
} from '@trg_package/vite/components';
import Conditions from './Conditions';
import GroupBy from './GroupBy';
import Filters from './Filters';

const ReportSettings = () => (
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
);

export default ReportSettings;
