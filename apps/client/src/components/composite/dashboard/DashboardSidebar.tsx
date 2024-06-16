import clsx from 'clsx';
import {
  Package2,
  Bell,
  ChevronDown,
  LucideProps,
  Eye,
  Home
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Button
} from '@/components/ui';
import { When } from '@/components/utility';
import { useNav } from '@/providers/NavigationProvider';

const DashboardSidebar: React.FC = () => {
  const navState = useNav();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Acme Inc</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Accordion type="single" collapsible className="w-full">
              {navState.map((navItem, index) => (
                <AccordionItem value={`item-${index}`}>
                  <Link
                    to={!navItem.children ? navItem.to : '#'}
                    className={clsx(
                      'flex items-center gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary w-full',
                      navItem.isActive &&
                        !navItem.children &&
                        'bg-muted text-primary',
                      navItem.children || 'hover:text-primary'
                    )}
                  >
                    <AccordionTrigger
                      className={clsx(
                        'pt-0 rounded-lg px-3 py-2 w-full',
                        navItem.isActive && 'bg-muted text-primary'
                      )}
                    >
                      <span className="flex gap-3 items-center w-full">
                        <navItem.icon className="w-4 h-4" />
                        {navItem.name}
                      </span>
                      <When condition={!!navItem.children}>
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                      </When>
                    </AccordionTrigger>
                  </Link>
                  <When condition={!!navItem.children}>
                    <AccordionContent className="flex flex-col gap-2 float-right pt-3">
                      {navItem.children?.map((child) => (
                        <Link
                          to={child.to}
                          className={clsx(
                            'flex items-center gap-3 rounded-lg py-1 text-muted-foreground transition-all hover:text-primary',
                            child.isActive && 'text-primary'
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </AccordionContent>
                  </When>
                </AccordionItem>
              ))}
            </Accordion>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
