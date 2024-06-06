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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Navigate to="/dashboard" />} />
      <Route element={<PublicRoutes />}>
        <Route path="register" element={<SignupForm />} />
        <Route path="login" element={<SigninForm />} />
      </Route>
      <Route element={<PrivateRoutes />} />
    </Route>
  )
);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
