import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './routes/Login';
import Signup from './routes/Signup';
import MyProfile from './routes/MyProfile';
import FriendProfile from './routes/FriendProfile';
import MyFeed from './routes/MyFeed';
import Posts from './routes/Posts';
import Protected from './routes/Protected';
import { AuthProvider } from './auth/AuthProvider';

const router = createBrowserRouter([
  {
    path: '/', // Ruta pública para el login
    element: <Login />
  },
  {
    path: '/signup', // Ruta pública para el registro
    element: <Signup />
  },
  {
    element: <Protected />, // Agrupamos las rutas protegidas aquí
    children: [
      { path: '/myfeed', element: <MyFeed /> },
      { path: '/myprofile', element: <MyProfile /> },
      { path: '/friendprofile', element: <FriendProfile /> },
      { path: '/myprofile/posts', element: <Posts /> }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Envolvemos la aplicación con el AuthProvider */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
