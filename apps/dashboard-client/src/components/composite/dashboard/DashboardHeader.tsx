import clsx from 'clsx';
import { Menu, Package2, Search, ChevronDown } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetTrigger,
  When
} from '@trg_package/components';
import { useAuth } from '@trg_package/providers';
import { useNav } from '@/providers/NavigationProvider';
import { ToggleThemeDropdown } from '../ToggleThemeDropdown';
import { ApiKeyDropdown } from '../ApiKeyDropdown';
import UserSettingsDropdown from '../UserSettingsDropdown';

const DashboardHeader: React.FC = () => {
  const { tenant } = useAuth();
  const { navigation } = useNav();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <NavLink
            to="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">{tenant}</span>
          </NavLink>
          <nav className="grid gap-2 text-lg font-medium">
            <Accordion type="single" collapsible className="w-full">
              {navigation.map(({ to, name, children, icon }, index) => (
                <AccordionItem value={`item-${index}`} key={to}>
                  <NavLink
                    to={!children ? to : '#'}
                    className={({ isActive }) =>
                      clsx(
                        'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-foreground',
                        isActive && !children && 'bg-muted text-primary',
                        children || 'hover:text-primary'
                      )
                    }
                  >
                    <AccordionTrigger
                      className={clsx('pt-0 rounded-lg px-3 py-2 w-full')}
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
                      <When condition={!!children}>
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                      </When>
                    </AccordionTrigger>
                  </NavLink>
                  <When condition={!!children}>
                    <AccordionContent className="flex flex-col gap-2 float-right pt-3">
                      {children?.map((child) => (
                        <NavLink
                          to={child.to}
                          key={child.to}
                          className={({ isActive }) =>
                            clsx(
                              'flex items-center gap-3 rounded-lg py-1 text-muted-foreground transition-all hover:text-primary',
                              isActive && 'text-primary'
                            )
                          }
                        >
                          {child.name}
                        </NavLink>
                      ))}
                    </AccordionContent>
                  </When>
                </AccordionItem>
              ))}
            </Accordion>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <ToggleThemeDropdown />
      <ApiKeyDropdown />
      <UserSettingsDropdown />
    </header>
  );
};

export default DashboardHeader;
