import React from 'react';
import { Button } from '@trg_package/vite/components';
import { useReports } from '@/providers/ReportsProvider';

const Sidebar: React.FC = () => {
  const { availableColumns, addColumn } = useReports();

  return (
    <div className="border-r bg-muted/40 flex  flex-col">
      <div className="flex items-center justify-center h-14 border-b px-4 lg:h-[60px] lg:px-6">
        <h2 className="text-xl font-bold">Available Columns</h2>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 pt-6 text-sm font-medium lg:px-4 gap-2">
          {availableColumns.map((column) => (
            <Button
              className="w-full"
              variant="secondary"
              key={column.name}
              onClick={() => addColumn(column)}
            >
              {column.name?.toUpperCase()}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
