import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom';
import { useAuth } from '@trg_package/vite/providers';
import { Loading, PrivateRoutes } from '@trg_package/vite/components';
import { ModuleMapper } from './components/utility';
import { DashboardLayout } from './components/composite';

const App = () => {
  const { permissions, loading } = useAuth();

  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route element={<PrivateRoutes />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          {permissions.map(({ module: { name }, actions }) => (
            <Route path={name.toLowerCase()} key={name}>
              <Route index element={<ModuleMapper module={name} />} />
              {actions.map<React.ReactNode>((action) => (
                <Route
                  path={`${action.toLowerCase()}`}
                  key={action}
                  element={<ModuleMapper module={name} action={action} />}
                />
              ))}
            </Route>
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
    ])
  );

  return loading ? <Loading /> : <RouterProvider router={router} />;
};

export default App;
