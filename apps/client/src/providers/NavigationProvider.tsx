import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Action, Module, Permissions } from '@/models';

interface NavItem {
  to: string;
  icon?: string;
  name: Module['name'];
  isActive: boolean;
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
      const nameLowercase = name.toLowerCase();
      const children: NavItem[] = actions.map((action) => {
        const actionLowercase = action.toLowerCase() as Lowercase<
          Action['name']
        >;
        return {
          to: `/dashboard/${nameLowercase}/${actionLowercase}`,
          name: action,
          isActive: false
        };
      });
      return {
        to: `/dashboard/${nameLowercase}`,
        name,
        children: [],
        isActive: false,
        icon
      };
    });
  };

  useEffect(() => {
    if (!permissions) return;
    const navigation = createNavLinksUsingPermissions(permissions);
    setNavState((prev) => ({ navigation, currentModule: prev.currentModule }));
  }, [permissions]);

  const findActiveNavItem = (
    prev: NavItemWithChildren[]
  ): NavigationProviderState => {
    let currentModule = 'Dashboard';
    const navigation = prev.map((navItem) => {
      const newNavItem = navItem;
      newNavItem.isActive = false;
      if (newNavItem.children?.length) {
        newNavItem.children.map((child) => {
          const newChild = child;
          newChild.isActive = false;
          if (location.pathname === newChild.to) {
            newChild.isActive = true;
            newNavItem.isActive = true;
            currentModule = newNavItem.name;
          }
          return newChild;
        });
      } else if (location.pathname.includes(newNavItem.to)) {
        newNavItem.isActive = true;
        currentModule = newNavItem.name;
      }
      return newNavItem;
    });

    return {
      navigation,
      currentModule
    };
  };

  useEffect(() => {
    setNavState((prev) => findActiveNavItem(prev.navigation));
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
