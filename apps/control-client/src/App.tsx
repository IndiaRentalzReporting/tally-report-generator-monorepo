import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements([<Route path="/" />])
  );

  return <RouterProvider router={router} />;
};

export default App;
