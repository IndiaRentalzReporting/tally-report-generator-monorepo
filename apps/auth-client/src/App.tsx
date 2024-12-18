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
      <Route path='/' element={<PublicRoutes/>}>
        <Route index element={<Navigate to="sign/up" />} />
        <Route path="sign/up" element={<SignUpForm />} />
        <Route path="sign/in" element={<SignInForm />} />
        <Route path="password/forgot" element={<ForgotPassword />} />
        <Route path="password/reset/:token" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="sign/up" />} />
      </Route>
    ])
  );

  return <RouterProvider router={router} />;
};

export default App;
