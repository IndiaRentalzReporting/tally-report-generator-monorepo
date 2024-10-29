import React from 'react';
import {
  Else, If, Then,
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuSkeleton,
  ElseIf
} from '@trg_package/vite/components';
import { Columns3, Plus } from 'lucide-react';
import { useReports } from '@/providers/ReportsProvider';

const ReportsSidebar: React.FC = () => {
  const { availableColumns, addColumn, fetchingColumns } = useReports();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex items-center gap-2 font-semibold">
                <Columns3 className="h-6 w-6"/>
                <span>Available Columns</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
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
                      <SidebarMenuButton>
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
      </SidebarContent>
    </Sidebar>
  );
};

export default ReportsSidebar;
