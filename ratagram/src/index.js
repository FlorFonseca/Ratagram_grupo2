/**
 * En index definimos todas las rutas de Ratagram tanto las publicas como las privadas
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Views/Login";
import Signup from "./Views/Signup";
import MyProfile from "./Views/MyProfile";
import FriendProfile from "./Views/FriendProfile";
import MyFeed from "./Views/MyFeed";
import Posts from "./Components/Publicacion";
import Protected from "./routes/Protected";
import { AuthProvider } from "./auth/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/", // Ruta pública para el login
    element: <Login />,
  },
  {
    path: "/signup", // Ruta pública para el registro
    element: <Signup />,
  },
  {
    element: <Protected />, // Acá agrupamos las rutas privadas o que están "Protected". Con el Outlet, en el archivo Protected.js, una vez que se verifica la autenticación del usuario, damos permiso a que se pueda acceder a los hijos de Protected (las rutas que se definen acá)
    children: [
      { path: "/myfeed", element: <MyFeed /> },
      { path: "/myprofile", element: <MyProfile /> },
      { path: "/friendprofile/:friendId", element: <FriendProfile /> },
      { path: "/myprofile/posts", element: <Posts /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <RouterProvider router={router} />
    {/*Router Provider es un children de AuthProvider, entonces se va a compartir el contexto guardado por AuthProvider */}
  </AuthProvider>
);
