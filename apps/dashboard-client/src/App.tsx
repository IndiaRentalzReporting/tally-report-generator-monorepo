import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom';
import { useAuth } from '@trg_package/vite/providers';
import { PrivateRoutes, Skeleton } from '@trg_package/vite/components';
import React, { Suspense, lazy } from 'react';
import {
  ActionSelect,
  ModuleSelect
} from '@trg_package/schemas-dashboard/types';
import DashboardLayout from './components/composite/dashboard/Layout';
import ReportingLayout from './components/composite/reports/Layout';
import TeamSwitchSkeleton from './components/composite/dashboard/TeamSwitchSkeleton';

const App = () => {
  const { permissions, switchTeam: { isLoading: isSwitchingTeam } } = useAuth();

  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route path='/' element={<PrivateRoutes/>}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path='/dashboard' element={<DashboardLayout />}>
          {
            permissions
              .filter((p) => !!p.actions.length)
              .map(({ module: { name }, actions }) => (
              <>
                <Route
                  path={name}
                  key={name}
                  element={<ModuleMapper module={name} action="Read" />}
                />
                {
                  name === 'Reports'
                  && <Route path={name} key={name} element={<ReportingLayout/>}>
                      {actions.map<React.ReactNode>((action) => (
                        (action === 'Read' || action === 'Update')
                          && <Route
                              path={`${action}/:reportId`}
                              key={action}
                              element={<ModuleMapper module={name} action={`${action}One`} />}
                            />
                      ))}
                    </Route>
                }
              </>
              ))
          }
        </Route>
        <Route path="*" element={<Navigate to="dashboard" />} />
      </Route>
    ])
  );

  return isSwitchingTeam ? <TeamSwitchSkeleton/> : <RouterProvider router={router} />;
};

export default App;

interface IModuleMapperProps {
  module: ModuleSelect['name'];
  action: ActionSelect['name'];
}

export const ModuleMapper: React.FC<IModuleMapperProps> = ({
  module,
  action
}) => {
  const Component = lazy(() => {
    const moduleImports = import.meta.glob<{ default: React.FC }>(['./views/**/Read.tsx', './views/**/*One.tsx']);
    const modulePath = `./views/${module}/${action}.tsx`;

    if (!moduleImports[modulePath]) {
      throw new Error(`Module ${modulePath} not found`);
    }

    return moduleImports[modulePath]().then((module) => module);
  });

  return (
    <Suspense fallback={<Skeleton isLoading className="h-full" />}>
      <Component />
    </Suspense>
  );
};
