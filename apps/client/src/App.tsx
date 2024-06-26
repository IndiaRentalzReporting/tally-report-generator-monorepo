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
            {permissions?.map(({ module: { name }, actions }, i1) => (
              <Route path={name.toLowerCase()} key={name}>
                <Route index element={<ModuleMapper module={name} />} />
                {actions
                  .filter((action) => action === 'Update')
                  .map<React.ReactElement>((action) => {
                    return (
                      <Route
                        path={`${action.toLowerCase()}/:id`}
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
