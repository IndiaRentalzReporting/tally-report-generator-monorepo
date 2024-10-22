import React from 'react';

import { useReports } from '@/providers/ReportsProvider';
import Select from './Select';

const GroupBy: React.FC = () => {
  const {
    columns, groupBy, setGroupBy
  } = useReports();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2 flex-1">Group By</h3>
      <Select
        label="Column"
        value={groupBy[0]?.column?.displayName}
        options={columns.filter((col) => !col.operation).map(({ column }) => {
          if (!column?.displayName) {
            return {
              label: 'No Name',
              value: 'No Name'
            };
          }
          return {
            label: column.displayName,
            value: column.displayName
          };
        })}
        onChange={(displayName) => {
          const column = columns
            .find((col) => col.column?.displayName === displayName);
          if (column) setGroupBy([{ id: Date.now(), column: column.column }]);
        }}
      />
    </div>
  );
};

export default GroupBy;
