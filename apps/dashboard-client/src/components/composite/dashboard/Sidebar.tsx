import { Package2 } from 'lucide-react';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  When,
  Sidebar as SidebarComponent,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarSeparator,
  SidebarGroupLabel
} from '@trg_package/vite/components';
import { cn } from '@trg_package/vite/lib/utils';
import { useAuth } from '@trg_package/vite/providers';
import { useNav } from '@/providers/NavigationProvider';
import UserSettings from '../header/UserSettings';
import AvailableColumns from '../reports/AvailableColumns';

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const isUpdate = pathname.includes('Update');

  const { tenant } = useAuth();
  const { navigation } = useNav();

  return (
    <SidebarComponent collapsible='icon' className="hidden border-r bg-muted/40 md:block">
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
                      className={cn(
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
          <AvailableColumns/>
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
    </SidebarComponent>
  );
};

export default Sidebar;
