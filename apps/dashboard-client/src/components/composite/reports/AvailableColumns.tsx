import { Plus } from 'lucide-react';
import React from 'react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  If,
  Then,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  ElseIf,
  SidebarMenuButton,
  Else
} from '@trg_package/vite/components';
import { useReports } from '@/providers/ReportsProvider';

const AvailableColumns: React.FC = () => {
  const { availableColumns, addColumn, fetchingColumns } = useReports();

  return (
    <SidebarGroup>
    <SidebarGroupLabel>Available Columns</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <If condition={fetchingColumns}>
          <Then>
            {Array.from({ length: 5 }).map((_, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuSkeleton showIcon/>
              </SidebarMenuItem>
            ))}
          </Then>
          <ElseIf condition={!!availableColumns.length}>
            {availableColumns.map((column) => (
              <SidebarMenuItem
                key={column.column.id}
                onClick={() => addColumn(column.column.id)}
              >
                <SidebarMenuButton className='h-auto'>
                  <Plus /> <span className="sr-only">Add Column</span>
                  {column.column.displayName}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </ElseIf>
          <Else>
            <div className="text-center">No columns available</div>
          </Else>
        </If>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
  );
};

export default AvailableColumns;
