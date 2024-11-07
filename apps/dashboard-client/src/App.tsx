import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom';
import { useAuth } from '@trg_package/vite/providers';
import { Loading, PrivateRoutes, Skeleton } from '@trg_package/vite/components';
import React, { Suspense, lazy } from 'react';
import {
  ActionSelect,
  ModuleSelect
} from '@trg_package/schemas-dashboard/types';
import DashboardLayout from './components/composite/dashboard/Layout';
import ReportingLayout from './components/composite/reports/Layout';

const App = () => {
  const { permissions, loading } = useAuth();
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route element={<PrivateRoutes />}>
        <Route index element={<Navigate to="/dashboard" />} />
        {permissions.map(({ module: { name }, actions }) => (
          <>
            <Route path='/dashboard' element={<DashboardLayout />}>
              <Route path={name} key={name}>
                {actions.map<React.ReactNode>((action) => (
                  <Route
                    path={action}
                    key={action}
                    element={<ModuleMapper module={name} action={action} />}
                  />
                ))}
              </Route>
            </Route>
            {
              name === 'Reports'
              && <Route path='/dashboard' element={<ReportingLayout/>}>
                  <Route path={name} key={name}>
                    {actions.map<React.ReactNode>((action) => (
                      (action === 'Read' || action === 'Update')
                        && <Route
                            path={`${action}/:reportId`}
                            key={action}
                            element={<ModuleMapper module={name} action={`${action}One`} />}
                          />
                    ))}
                  </Route>
                </Route>
            }
          </>
        ))}
        {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
      </Route>
    ])
  );

  return loading ? <Loading /> : <RouterProvider router={router} />;
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
  const Component = lazy(
    () => import(`./views/${module}/${action}`)
  );

  return (
    <Suspense fallback={<Skeleton isLoading className="h-full" />}>
      <Component />
    </Suspense>
  );
};
