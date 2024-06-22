import clsx from 'clsx';
import { Package2, Bell, ChevronDown } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
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
              {navState.map(({ isActive, name, to, children, icon }, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <Link
                    to={to}
                    className={clsx(
                      'flex items-center gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary w-full',
                      isActive && !children && 'bg-muted text-primary',
                      children || 'hover:text-primary'
                    )}
                  >
                    <AccordionTrigger
                      className={clsx(
                        'pt-0 rounded-lg px-3 py-2 w-full',
                        isActive && 'bg-muted text-primary'
                      )}
                    >
                      <span className="flex gap-3 items-center w-full">
                        <When condition={!!icon}>
                          <div
                            dangerouslySetInnerHTML={{ __html: icon as string }}
                          />
                        </When>
                        {name}
                      </span>
                      <When condition={!!children}>
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                      </When>
                    </AccordionTrigger>
                  </Link>
                  <When condition={!!children}>
                    <AccordionContent className="flex flex-col float-right pb-0 py-2 px-3 ps-6 w-full">
                      {children?.map((child, index) => (
                        <Link
                          to={child.to}
                          key={index}
                          className={clsx(
                            'flex items-center gap-3 rounded-lg py-1 text-muted-foreground transition-all hover:text-primary',
                            child.isActive && 'text-primary'
                          )}
                        >
                          <div className="mt-2 w-full h-[1px] bg-border self-stretch flex-grow" />

                          <span className="flex gap-3 items-center flex-shrink">
                            {/* <child.icon className="w-4 h-4" /> */}
                            {child.name}
                          </span>
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
