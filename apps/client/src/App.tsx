import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom';
import { PublicRoutes, PrivateRoutes } from './components/utility';
import {
  SignupForm,
  SigninForm,
  Dashboard,
  ModuleMapper,
  ForgotPassword,
  ResetPassword
} from './views';
import { DashboardLayout } from './components/composite';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './providers/AuthProvider';

const App = () => {
  const { permissions } = useAuth();

  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route path="/">
        <Route index element={<Navigate to="/dashboard" />} />
        <Route element={<PublicRoutes />}>
          <Route path="sign-up" element={<SignupForm />} />
          <Route path="sign-in" element={<SigninForm />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
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
      </Route>
    ])
  );

  return <RouterProvider router={router} />;
};

export default App;
