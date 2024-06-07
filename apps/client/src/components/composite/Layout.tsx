import React, {
  ChangeEvent,
  MouseEvent,
  MouseEventHandler,
  useState
} from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import {
  Bell,
  CircleUser,
  Home,
  LucideProps,
  Menu,
  Package,
  Package2,
  Search,
  Eye,
  Users
} from 'lucide-react';

import clsx from 'clsx';
import { useAuth } from '@/providers/AuthProvider';
import {
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
import { ToggleTheme } from '@/components/composite';

interface State {
  to: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  name: string;
  isActive: boolean;
}

const navigation: State[] = [
  {
    to: '/dashboard',
    icon: Home,
    name: 'Dashboard',
    isActive: true
  },
  {
    to: '/dashboard/roles',
    icon: Eye,
    name: 'Role',
    isActive: false
  },
  {
    to: '#',
    icon: Package,
    name: 'Products',
    isActive: false
  },
  {
    to: '#',
    icon: Users,
    name: 'Customer',
    isActive: false
  }
];
export const Layout = () => {
  const [navState, setNavState] = useState<State[]>(navigation);
  const { signOut } = useAuth();

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const { lastChild } = e.currentTarget;
    setNavState((prev) => {
      prev = prev.map((navElement) => {
        // @ts-ignore
        navElement.isActive = navElement.name === lastChild?.innerHTML;
        return navElement;
      });
      return prev;
    });
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
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
              {navState.map((navItem) => (
                <Link
                  to={navItem.to}
                  onClick={handleNavClick}
                  className={clsx(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    navItem.isActive && 'bg-muted text-primary'
                  )}
                >
                  <navItem.icon className="w-4 h-4" />
                  <span>{navItem.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
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
                {navState.map((navItem) => (
                  <Link
                    to={navItem.to}
                    onClick={handleNavClick}
                    className={clsx(
                      'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-foreground',
                      navItem.isActive && 'bg-muted text-primary'
                    )}
                  >
                    <navItem.icon className="w-5 h-5" />
                    <span>{navItem.name}</span>
                  </Link>
                ))}
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
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">
              {navState.find((nav) => !!nav.isActive)?.name}
            </h1>
          </div>
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
            x-chunk="dashboard-02-chunk-1"
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
