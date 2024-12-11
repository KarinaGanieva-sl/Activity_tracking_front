import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import Projects from './pages/Projects';
import NotFound from './pages/Page404';
import AddProject from './pages/AddProject';
import Settings from './pages/Settings';
import UserInfo from './pages/UserInfo';
import ProjectInfo from './pages/ProjectInfo';
// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'projects', element: <Projects /> },
        { path: 'add_project', element: <AddProject /> },
        { path: 'register', element: <Register /> },
        { path: 'settings', element: <Settings /> },
        { path: 'products', element: <Products /> },
        { path: 'user/:id', element: <UserInfo /> },
        { path: 'project/:id', element: <ProjectInfo /> },
        { path: 'blog', element: <Blog /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
