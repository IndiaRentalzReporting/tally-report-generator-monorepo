import { Plus } from 'lucide-react';
import React from 'react';
import {
  If,
  Then,
  SidebarMenuSkeleton,
  ElseIf,
  Else,
  SidebarMenuButton
} from '@trg_package/vite/components';
import { useReports } from '@/providers/ReportsProvider';

const AvailableColumns: React.FC = () => {
  const { availableColumns, addColumn, fetchingColumns } = useReports();

  return (
    <div >
      <If condition={fetchingColumns}>
        <Then>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>
              <SidebarMenuSkeleton showIcon/>
            </div>
          ))}
        </Then>
        <ElseIf condition={!!availableColumns.length}>
          {availableColumns.map((column) => (
            <SidebarMenuButton className='h-auto' onClick={() => addColumn(column.column.id)}>
              <Plus /> <span className="sr-only">Add Column</span>
              {column.column.displayName}
            </SidebarMenuButton>
          ))}
        </ElseIf>
        <Else>
          <div className="text-center">No columns available</div>
        </Else>
      </If>
    </div>
  );
};

export default AvailableColumns;
