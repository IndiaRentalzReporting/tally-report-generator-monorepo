import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom';
import { PublicRoutes, PrivateRoutes } from './components/utility';
import { SignupForm, SigninForm, Dashboard } from './views';
import { Layout } from './components/composite';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import 'react-toastify/dist/ReactToastify.css';
import Roles from './views/Roles';

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Navigate to="/dashboard" />} />,
    <Route element={<PublicRoutes />}>
      <Route path="sign-up" element={<SignupForm />} />
      <Route path="sign-in" element={<SigninForm />} />
    </Route>,
    <Route element={<PrivateRoutes />}>
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="roles" element={<Roles />} />
      </Route>
    </Route>
  ])
);
const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
