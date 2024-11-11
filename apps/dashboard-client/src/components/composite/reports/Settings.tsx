import React from 'react';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from '$/components';
import AvailableColumns from './AddColumns';
import Conditions from './AddConditions';
import GroupBy from './AddGroupBy';
import Filters from './AddFilters';

const Settings: React.FC = () => (
  <div className='flex items-start gap-6 w-full'>
    <Card className='self-stretch'>
      <CardHeader>
        <CardTitle>Add Columns</CardTitle>
        <CardDescription>
          These are the columns that will be used to generate the report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AvailableColumns/>
      </CardContent>
    </Card>
    <Card className='flex-grow'>
      <CardHeader>
        <CardTitle>Report Settings</CardTitle>
        <CardDescription>
          These are the settings that will be used to generate the report.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-6'>
        <GroupBy />
        <Conditions />
        <Filters />
      </CardContent>
    </Card>
  </div>
);

export default Settings;
