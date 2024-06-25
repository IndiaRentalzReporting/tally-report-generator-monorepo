import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Module, Permissions } from '@/models';

const NavigationContext = createContext<NavigationProviderState[]>([]);

export interface NavigationProviderProps {
  children: React.ReactNode;
}

interface NavItem {
  to: string;
  icon?: string;
  name: Module['name'];
  isActive: boolean;
}
export interface NavigationProviderState extends NavItem {
  children?: NavItem[];
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const location = useLocation();
  const [navState, setNavState] = useState<NavigationProviderState[]>([]);
  const { permissions } = useAuth();

  const createNavLinksUsingPermissions = (
    permissions: Permissions[]
  ): NavItem[] => {
    return permissions.map((permission) => {
      const {
        module: { name, icon }
      } = permission;
      return {
        to: `/dashboard/${name.toLowerCase()}`,
        name,
        isActive: false,
        icon
      };
    });
  };

  useEffect(() => {
    if (!permissions) return;
    const links = createNavLinksUsingPermissions(permissions);
    setNavState(links);
  }, [permissions]);

  useEffect(() => {
    setNavState((prev) =>
      prev.map((navItem) => {
        navItem.isActive = false;
        /* if (navItem.children) {
          navItem.children.map((child) => {
            child.isActive = false;
            if (location.pathname === child.to) {
              child.isActive = true;
              navItem.isActive = true;
            }
            return child;
          });
        } else if (location.pathname.includes(navItem.to)) navItem.isActive = true */
        if (location.pathname.includes(navItem.to)) navItem.isActive = true;
        return navItem;
      })
    );
  }, [location, permissions]);

  return (
    <NavigationContext.Provider value={navState}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNav = () => {
  const navState = useContext(NavigationContext);

  if (!navState) {
    throw new Error('useNav must be used within a NavigationProvider');
  }

  return navState;
};
