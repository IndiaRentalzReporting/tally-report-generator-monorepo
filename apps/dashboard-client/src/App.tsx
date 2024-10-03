import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom';
import { PrivateRoutes, ModuleMapper } from './components/utility';
import { DashboardLayout } from './components/composite';
import { useAuth } from '@trg_package/providers';

const App = () => {
  const { permissions } = useAuth();

  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route element={<PrivateRoutes />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          {permissions?.map(({ module: { name }, actions }) => (
            <Route path={name.toLowerCase()} key={name}>
              <Route index element={<ModuleMapper module={name} />} />
              {actions.map<React.ReactNode>((action) => {
                return (
                  <Route
                    path={`${action.toLowerCase()}`}
                    key={action}
                    element={<ModuleMapper module={name} action={action} />}
                  />
                );
              })}
            </Route>
          ))}
        </Route>
      </Route>
    ])
  );

  return <RouterProvider router={router} />;
};

export default App;
