import {
  LucideProps,
  Package,
  Trash2 as Delete,
  Eye as Read,
  PencilLine as Create
} from 'lucide-react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Case, Switch } from '@/components/utility';

const NavigationContext = createContext<NavigationProviderState[]>([]);

interface NavigationProviderProps {
  children: React.ReactNode;
}

interface NavItem {
  to: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  name: string;
  isActive: boolean;
}
interface NavigationProviderState extends NavItem {
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
        const { module: moduleName, actions } = permission;
        const childrenLinks: NavItem[] = actions.map((actionName) => {
          return {
            to: `/dashboard/${moduleName.toLowerCase()}/${actionName.toLowerCase()}`,
            isActive: false,
            name: actionName,
            icon: Create
          };
        });
        return {
          to: '#',
          name: moduleName,
          children: childrenLinks,
          isActive: false,
          icon: Package
        };
      })
    );

    const fetchActionIcon = (action: string): React.ReactNode => {
      return (
        <Switch control={action}>
          <Case value="create">{Create}</Case>
          <Case value="read">{Read}</Case>
          <Case value="update">{Read}</Case>
          <Case value="delete">{Delete}</Case>
        </Switch>
      );
    };
  }, [permissions]);

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
