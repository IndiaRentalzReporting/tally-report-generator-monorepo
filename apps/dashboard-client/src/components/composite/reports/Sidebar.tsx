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
  ElseIf,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarSeparator,
  SidebarTrigger,
  When
} from '@trg_package/vite/components';
import { Package2, Plus } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '@trg_package/vite/providers';
import { useReports } from '@/providers/ReportsProvider';
import { useNav } from '@/providers/NavigationProvider';
import UserSettings from '../header/UserSettings';

const ReportsSidebar: React.FC = () => {
  const { pathname } = useLocation();
  const isRead = pathname.includes('read');
  const isUpdate = pathname.includes('update');

  const { tenant } = useAuth();
  const { navigation } = useNav();
  const { availableColumns, addColumn, fetchingColumns } = useReports();

  return (
    <Sidebar collapsible='icon' className="hidden border-r bg-muted/40 md:block">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <NavLink to="/" className="flex items-center gap-2 font-semibold">
                <Package2 />
                <span>{tenant}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel>Routes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map(({
                name, to, children, icon
              }) => (
                <SidebarMenuItem value={`item-${name}`} key={name}>
                  <SidebarMenuButton>
                    <NavLink
                      to={to}
                      className={clsx(
                        'flex items-center gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary w-full',
                        children || 'hover:text-primary'
                      )}
                    >
                      <span className="flex gap-3 items-center w-full">
                        <When condition={!!icon}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: icon as string
                            }}
                          />
                        </When>
                        {name}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <When condition={isUpdate}>
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
        </When>
        <When condition={isRead}>
          <SidebarGroup>
            <SidebarGroupLabel>Filters</SidebarGroupLabel>
            <SidebarGroupContent />
          </SidebarGroup>
        </When>
      </SidebarContent>
      <SidebarFooter >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-min float-right">
              <SidebarTrigger/>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator/>
        <UserSettings/>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ReportsSidebar;
