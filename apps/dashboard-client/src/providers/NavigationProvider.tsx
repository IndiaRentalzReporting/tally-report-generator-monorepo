import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import {
  ActionSelect,
  ModuleSelect,
  Permissions
} from '@trg_package/dashboard-schemas/types';
import { toTitleCase } from '@/lib/utils';

interface NavItem {
  to: string;
  icon?: string | null;
  name: ModuleSelect['name'];
}
export interface NavItemWithChildren extends NavItem {
  children?: NavItem[];
}

export interface NavigationProviderState {
  navigation: NavItemWithChildren[];
  currentModule: string;
}

const initialState: NavigationProviderState = {
  navigation: [],
  currentModule: ''
};

export interface NavigationProviderProps {
  children: React.ReactNode;
}

const NavigationContext = createContext<NavigationProviderState>(initialState);

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const location = useLocation();
  const [navState, setNavState] =
    useState<NavigationProviderState>(initialState);
  const { permissions } = useAuth();

  const createNavLinksUsingPermissions = (
    permissions: Permissions[]
  ): NavItemWithChildren[] => {
    return permissions.map((permission) => {
      const {
        module: { name, icon },
        actions
      } = permission;
      const moduleName = name.toLowerCase();
      const children: NavItem[] = actions.map((action) => {
        const moduleAction = action.toLowerCase() as Lowercase<
          ActionSelect['name']
        >;
        return {
          to: `/dashboard/${moduleName}/${moduleAction}`,
          name: action
        };
      });
      return {
        to: `/dashboard/${moduleName}`,
        name,
        children: [] ?? children,
        icon
      };
    });
  };

  useEffect(() => {
    if (!permissions) return;
    const navigation = createNavLinksUsingPermissions(permissions);
    setNavState((prev) => ({ navigation, currentModule: prev.currentModule }));
  }, [permissions]);

  useEffect(() => {
    setNavState((prev) => ({
      ...prev,
      currentModule: toTitleCase(location.pathname.split('/')[2] ?? '')
    }));
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
