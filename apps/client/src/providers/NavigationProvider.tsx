import { LucideProps, Home, Eye } from 'lucide-react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationContext = createContext<NavigationProviderState[] | null>(null);

interface NavigationProviderProps {
  children: React.ReactNode;
}

interface NavigationProviderState {
  to: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  name: string;
  isActive: boolean;
  children?: {
    to: string;
    icon?: React.ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
    >;
    name: string;
    isActive: boolean;
  }[];
}

const initialNavigation: NavigationProviderState[] = [
  {
    to: '/dashboard',
    icon: Home,
    name: 'Dashboard',
    isActive: false
  },
  {
    to: '/roles',
    icon: Eye,
    name: 'Role',
    isActive: false,
    children: [
      {
        name: 'Assign Role',
        to: '/dashboard/assign/roles',
        isActive: false
      },
      {
        name: 'Create Role',
        to: '/dashboard/create/roles',
        isActive: false
      }
    ]
  }
];

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children
}) => {
  const location = useLocation();
  const [navState, setNavState] =
    useState<NavigationProviderState[]>(initialNavigation);

  useEffect(() => {
    setNavState((prev) =>
      prev.map((navItem) => {
        navItem.isActive = false;
        if (navItem.children) {
          if (location.pathname.includes(navItem.to)) navItem.isActive = true;
          navItem.children.map((child) => {
            child.isActive = false;
            if (location.pathname === child.to) child.isActive = true;
            return child;
          });
        } else if (location.pathname === navItem.to) navItem.isActive = true;
        return navItem;
      })
    );
  }, [location]);

  return (
    <NavigationContext.Provider value={navState}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNav = () => {
  const navState = useContext(NavigationContext);

  if (!navState) {
    throw new Error('useNav should be used inside NavigationProvider');
  }

  return navState;
};
