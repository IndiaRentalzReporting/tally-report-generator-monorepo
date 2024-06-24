import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Modules } from '@/models';

const NavigationContext = createContext<NavigationProviderState[]>([]);

export interface NavigationProviderProps {
  children: React.ReactNode;
}

interface NavItem {
  to: string;
  icon?: string;
  name: Modules;
  isActive: boolean;
}
export interface NavigationProviderState extends NavItem {
  children?: NavItem[];
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children
}) => {
  const location = useLocation();
  const [navState, setNavState] = useState<NavigationProviderState[]>([]);
  const { permissions } = useAuth();

  useEffect(() => {
    if (!permissions) return;
    setNavState(
      permissions.map((permission) => {
        const {
          module: { name, icon },
          actions
        } = permission;
        /* const childrenLinks: NavItem[] = actions.map((actionName) => {
          return {
            to: `/dashboard/${name.toLowerCase()}/${actionName.toLowerCase()}`,
            isActive: false,
            name: actionName
            // icon: Create
          };
        }); */
        return {
          to: `/dashboard/${name.toLowerCase()}`,
          name,
          isActive: false,
          icon
        };
      })
    );
  }, [permissions]);

  useEffect(() => {
    setNavState((prev) =>
      prev.map((navItem) => {
        navItem.isActive = false;
        if (navItem.children) {
          navItem.children.map((child) => {
            child.isActive = false;
            if (location.pathname === child.to) {
              child.isActive = true;
              navItem.isActive = true;
            }
            return child;
          });
        } else if (location.pathname.includes(navItem.to))
          navItem.isActive = true;
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
    throw new Error('useNav should be used inside NavigationProvider');
  }

  return navState;
};
