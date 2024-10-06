import React from 'react';
import { Button } from '@trg_package/vite/components';
import { useReports } from '@/providers/ReportsProvider';

const Sidebar: React.FC = () => {
  const { availableColumns, addColumn } = useReports();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex items-center justify-center h-14 border-b px-4 lg:h-[60px] lg:px-6">
          <h2 className="text-xl font-bold">Available Columns</h2>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-2">
            {availableColumns.map((col) => (
              <Button
                className="w-full"
                variant="secondary"
                key={col.name}
                onClick={() => addColumn(col)}
              >
                {col.name.toUpperCase()}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
