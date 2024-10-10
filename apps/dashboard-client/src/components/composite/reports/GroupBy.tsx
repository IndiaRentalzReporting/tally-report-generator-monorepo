import React from 'react';

import { useReports } from '@/providers/ReportsProvider';
import Select from './Select';

const GroupBy: React.FC = () => {
  const { columns, groupBy, setGroupBy } = useReports();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2 flex-1">Group By</h3>
      <Select
        label="Column"
        value={groupBy?.name}
        options={columns.map(({ column }) => ({
          label: column.name,
          value: column.name
        }))}
        onChange={(columnName) => {
          const column = columns.find((col) => col.column.name === columnName);
          if (column) setGroupBy(column.column);
        }}
      />
    </div>
  );
};

export default GroupBy;
