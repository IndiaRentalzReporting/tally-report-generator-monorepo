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
  SidebarSeparator,
  SidebarGroupLabel,
  useSidebar
} from '@trg_package/vite/components';
import { useAuth } from '@trg_package/vite/providers';
import { useNav } from '@/providers/NavigationProvider';
import User from '../user';

const Sidebar: React.FC = () => {
  const { tenant } = useAuth();
  const { navigation } = useNav();
  const { state } = useSidebar();

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
                name, to, icon
              }) => (
                <SidebarMenuItem value={`item-${name}`} key={name}>
                  <SidebarMenuButton
                    asChild
                    tooltip={{
                      children: name,
                      hidden: state !== 'collapsed',
                    }}
                  >
                    <NavLink to={to}>
                      <When condition={!!icon}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: icon as string
                          }}
                        />
                      </When>
                      <span>{name}</span>
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
        <User/>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
