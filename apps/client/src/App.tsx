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
import AssignRole from './views/Roles/AssignRole';
import CreateModule from './views/Modules/CreateModule';

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
          <Route path="create">
            <Route path="role" element={<CreateRole />} />
            <Route path="module" element={<CreateModule />} />
          </Route>
          <Route path="assign">
            <Route path="role" element={<AssignRole />} />
          </Route>
        </Route>
      </Route>
    </Route>
  ])
);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
