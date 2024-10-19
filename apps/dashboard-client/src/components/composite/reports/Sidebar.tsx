import React from 'react';
import {
  Button, Else, If, Skeleton, Then
} from '@trg_package/vite/components';
import { useReports } from '@/providers/ReportsProvider';

const Sidebar: React.FC = () => {
  const { availableColumns, addColumn, fetchingColumns } = useReports();

  return (
    <div className="border-r bg-muted/40 flex  flex-col">
      <div className="flex items-center justify-center h-14 border-b px-4 lg:h-[60px] lg:px-6">
        <h2 className="text-xl font-bold">Available Columns</h2>
      </div>
      <div className="flex-1 px-2 pt-6 lg:px-4">
        <Skeleton isLoading={fetchingColumns}>
          <nav className="grid items-start text-sm font-medium  gap-2">
            <If condition={!!availableColumns.length}>
              <Then>
                {availableColumns.map((column) => (
                  <Button
                  className="w-full"
                  variant="secondary"
                  key={column.column?.displayName}
                  onClick={() => addColumn(column.id)}
                  >
                    {column.column?.displayName.toUpperCase()}
                  </Button>
                ))}
              </Then>
              <Else>
                <div className="text-center">No columns available</div>
              </Else>
          </If>
          </nav>
        </Skeleton>
      </div>
    </div>
  );
};

export default Sidebar;
