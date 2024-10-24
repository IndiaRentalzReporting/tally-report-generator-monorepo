import clsx from 'clsx';
import { Package2 } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  When,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent
} from '@trg_package/vite/components';
import { useAuth } from '@trg_package/vite/providers';
import { useNav } from '@/providers/NavigationProvider';

const DashboardSidebar: React.FC = () => {
  const { tenant } = useAuth();
  const { navigation } = useNav();

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
          {/* <SidebarGroupLabel>Routes</SidebarGroupLabel> */}
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
                  {/* <When condition={!!children?.length}>
                    <AccordionContent className="flex flex-col float-right pb-0 py-2 px-3 ps-6 w-full">
                      {children?.map((child) => (
                        <NavLink
                          to={child.to}
                          key={child.name}
                          className={({ isActive }) => clsx(
                            'flex items-center gap-3 rounded-lg py-1 text-muted-foreground transition-all hover:text-primary',
                            isActive && 'text-primary'
                          )
                          }
                        >
                          <div className="mt-2 w-full h-[1px] bg-border self-stretch flex-grow" />
                          <span className="flex gap-3 items-center flex-shrink">
                            {child.name}
                          </span>
                        </NavLink>
                      ))}
                    </AccordionContent>
                  </When> */}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter >
        <SidebarTrigger/>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
