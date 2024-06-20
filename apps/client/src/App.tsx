import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom';
import { PublicRoutes, PrivateRoutes } from './components/utility';
import { SignupForm, SigninForm, Dashboard, ModuleMapper } from './views';
import { DashboardLayout, RootLayout } from './components/composite';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './providers/AuthProvider';

const App = () => {
  const { permissions } = useAuth();
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route element={<PublicRoutes />}>
          <Route path="sign-up" element={<SignupForm />} />
          <Route path="sign-in" element={<SigninForm />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            {permissions?.map(({ module }, index) => (
              <Route
                path={module.toLowerCase()}
                key={index}
                element={<ModuleMapper module={module} />}
              />
            ))}
          </Route>
        </Route>
      </Route>
    ])
  );

  return <RouterProvider router={router} />;
};

export default App;
