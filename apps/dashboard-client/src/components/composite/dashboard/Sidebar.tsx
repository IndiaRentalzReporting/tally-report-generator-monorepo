import clsx from 'clsx';
import { Package2 } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
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
  SidebarSeparator
} from '@trg_package/vite/components';
import { useAuth } from '@trg_package/vite/providers';
import { useNav } from '@/providers/NavigationProvider';
import UserSettings from '../header/UserSettings';

const Sidebar: React.FC = () => {
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
