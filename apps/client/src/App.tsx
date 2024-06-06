import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom';
import { PublicRoutes, PrivateRoutes } from './components/utility';
import { SignupForm, SigninForm } from './views';
import { Layout } from './components/composite';
import { ThemeProvider } from './providers/ThemeProvider';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Navigate to="/dashboard" />} />
      <Route element={<PublicRoutes />}>
        <Route path="sign-up" element={<SignupForm />} />
        <Route path="sign-in" element={<SigninForm />} />
      </Route>
      <Route element={<PrivateRoutes />} />
    </Route>
  )
);
const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
