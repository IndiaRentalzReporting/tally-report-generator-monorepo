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

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Layout />}>
      <Route index element={<Navigate to="/dashboard" />} />
      <Route element={<PublicRoutes />}>
        <Route path="sign-up" element={<SignupForm />} />
        <Route path="sign-in" element={<SigninForm />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route path="dashboard" element={<Dashboard />} />
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
