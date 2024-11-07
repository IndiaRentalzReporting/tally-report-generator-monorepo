import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom';
import { PublicRoutes } from '@trg_package/vite/components';
import { SignUpForm } from '@/views/Authentication/Signup';
import { SignInForm } from '@/views/Authentication/Signin';
import { ForgotPassword } from '@/views/Authentication/ForgotPassword';
import { ResetPassword } from '@/views/Authentication/ResetPassword';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route element={<PublicRoutes />}>
        <Route element={<Navigate to="sign-up" />} index />
        <Route element={<SignUpForm />} path="sign-up" />
        <Route element={<SignInForm />} path="sign-in" />
        <Route element={<ForgotPassword />} path="forgot-password" />
        <Route element={<ResetPassword />} path="reset-password/:token" />
        <Route path="*" element={<Navigate to="sign-up" />} />
      </Route>
    ])
  );

  return <RouterProvider router={router} />;
};

export default App;
