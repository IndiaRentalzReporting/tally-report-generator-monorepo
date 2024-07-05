import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom';
import {
  PublicRoutes,
  PrivateRoutes,
  Switch,
  Case,
  If,
  Then,
  Else
} from './components/utility';
import { SignupForm, SigninForm, Dashboard, ModuleMapper } from './views';
import { DashboardLayout, RootLayout } from './components/composite';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './providers/AuthProvider';
import ForgotPassword from './views/ForgotPassword';

const App = () => {
  const { permissions } = useAuth();
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route element={<PublicRoutes />}>
          <Route path="sign-up" element={<SignupForm />} />
          <Route path="sign-in" element={<SigninForm />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            {permissions?.map(({ module: { name }, actions }) => (
              <Route path={name.toLowerCase()} key={name}>
                <Route index element={<ModuleMapper module={name} />} />
                {actions.map<React.ReactElement>((action) => {
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
