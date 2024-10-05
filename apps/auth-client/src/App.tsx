import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom';
import { PublicRoutes } from '@trg_package/vite/components';
import {
  SignupForm,
  SigninForm,
  ForgotPassword,
  ResetPassword
} from '@/views/Authentication';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route element={<PublicRoutes />}>
        <Route element={<Navigate to="/sign-up" />} index />
        <Route element={<SignupForm />} path="sign-up" />
        <Route element={<SigninForm />} path="sign-in" />
        <Route element={<ForgotPassword />} path="forgot-password" />
        <Route element={<ResetPassword />} path="reset-password/:token" />
      </Route>
    ])
  );

  return <RouterProvider router={router} />;
};

export default App;
