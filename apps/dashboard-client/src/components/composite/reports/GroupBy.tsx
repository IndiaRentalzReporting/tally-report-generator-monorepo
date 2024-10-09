import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem
} from '@trg_package/vite/components';
import { useReports } from '@/providers/ReportsProvider';

const GroupBy: React.FC = () => {
  const { columns } = useReports();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2 flex-1">Group By</h3>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Column" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Columns</SelectLabel>
            {columns.map((column) => (
              <SelectItem value={column.name}>{column.name}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default GroupBy;
