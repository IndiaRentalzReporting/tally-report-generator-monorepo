import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom';
import { PublicRoutes, PrivateRoutes } from './components/utility';
import { SignupForm, SigninForm, Dashboard } from './views';
import { DashboardLayout, RootLayout } from './components/composite';
import 'react-toastify/dist/ReactToastify.css';
import CreateRole from './views/Roles/CreateRole';
import { useAuth } from './providers/AuthProvider';

const App = () => {
  const { permissions } = useAuth();
  console.log({ permissions });
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
            {permissions?.map(({ module, actions }, index) => {
              return (
                <Route path={module.toLowerCase()} key={index}>
                  {actions?.map((action, i) => (
                    <Route
                      key={i}
                      path={action.toLowerCase()}
                      element={<CreateRole />}
                    />
                  ))}
                </Route>
              );
            })}
          </Route>
        </Route>
      </Route>
    ])
  );

  return <RouterProvider router={router} />;
};

export default App;
