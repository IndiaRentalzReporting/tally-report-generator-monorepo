import React from 'react';

import { MultiSelect } from '@trg_package/vite/components';
import { useReports } from '@/providers/ReportsProvider';

const GroupBy: React.FC = () => {
  const {
    columns, groupBy, setGroupBy
  } = useReports();

  return (
    <div className='space-y-2'>
      <MultiSelect
        title='Group By'
        options={columns.filter((col) => !col.operation).map((col) => ({
          label: col.column.displayName || 'No Label',
          value: col.column.displayName || 'No Value'
        }))}
        values={groupBy.map((group) => group.column.displayName)}
        onChange={(values) => {
          const columnToAdd = Array.from(
            new Set(columns.filter((col) => values.includes(col.column.displayName)))
          );
          setGroupBy(columnToAdd);
        }}
      />
    </div>
  );
};

export default GroupBy;
