import clsx from 'clsx';
import { Menu, Package2, CircleUser, Search, ChevronDown } from 'lucide-react';
import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { When } from '@/components/utility';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui';
import { ToggleTheme } from '../ToggleTheme';
import services from '@/services';
import { useAuth } from '@/providers/AuthProvider';
import { useNav } from '@/providers/NavigationProvider';

const DashboardHeader: React.FC = () => {
  const navState = useNav();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: signOutMutation } = useMutation({
    mutationFn: () => services.auth.signOut(),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['auth', 'statusCheck'] });
      navigate('/sign-in');
    }
  });

  const { user, loading } = useAuth();
  const userName = useMemo(
    () => `${user?.first_name} ${user?.last_name}`,
    [user]
  );

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
          <Link
            to="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <nav className="grid gap-2 text-lg font-medium">
            <Accordion type="single" collapsible className="w-full">
              {navState.map(({ isActive, to, name, children, icon }, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <Link
                    to={!children ? to : '#'}
                    className={clsx(
                      'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-foreground',
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
                    <AccordionContent className="flex flex-col gap-2 float-right pt-3">
                      {children?.map((child, index) => (
                        <Link
                          to={child.to}
                          key={index}
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
      <ToggleTheme />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOutMutation()}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default DashboardHeader;
