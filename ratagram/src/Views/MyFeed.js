/**
 * Mostramos el feed de cada usuario, aquí se ven las publicaciones que los diferentes usuarios logueados suben a
 * Ratagram.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate
import "../styles/FeedStyle.css";
import Publicacion from "../Components/Publicacion";
import PersistentDrawerLeft from "../Components/Drawer";
import { useAuth } from "../auth/AuthProvider";

export default function MyFeed() {
  const navigate = useNavigate(); // navigate nos permitirá poder redireccionar la página a la ruta que sea necesaria en el momento
  const [posts, setPosts] = useState([]); // este useState permite almacenar los diferentes uploads (posts) que hacen los usuarios
  const [message, setMessage] = useState(""); // creamos un mensaje ya sea para indicar un cargado del feed exitoso o algún error. Esto nos sirve para verificar la respuesta del backend
  const { user: currentUser } = useAuth();

  // Función para obtener los posts del feed
  const handleFeed = async () => {
    try {
      //Acá esperamos la respuesta del backend al hacer un GET del feed
      const response = await fetch("http://localhost:3001/api/posts/feed", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // En el backend se muestra una condición "&&" donde se necesita que el header contenga la autorización, incluyendo el 'Bearer' y el token, por eso lo pusimos así.
        },
      });

      const data = await response.json(); //Estos son los posts que obtenemos
      //console.log(data); // Esto es solo para verificar la respuesta del backend

      if (response.ok) {
        setPosts(data || []); //Acá cargamos los posts que obtenemos de la db
        // setMessage("Feed cargado exitosamente");
      } else {
        setMessage(data.message || "Error al cargar el feed");
        // Si, por alguna razón, la respuesta indica que el usuario no está autorizado, entonces redirigimos al login. Esto funciona como un doble chequeo, ya que al feed no se debería acceder si el usuario no está logueado (logica ya explicada en Login.js)
        if (response.status === 401) {
          localStorage.removeItem("token"); // Elimina el token si no está autorizado
          navigate("/login"); // Redirige al login
        }
      }
    } catch (error) {
      setMessage("Error en el servidor");
      console.error("Error al cargar el feed: ", error);
    }
  };

  useEffect(() => {
    handleFeed(); // Cargar los posts al montar el componente feed
  }, []);

  return (
    <div className="feedRatagram">
      <h1 className="titulo"></h1>
      {message && <p>{message}</p>} {/* Muestra el mensaje */}
      {posts && posts.length > 0 ? (
        posts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Ordenar posts por createdAt en orden descendente
          .map((post) => (
            <Publicacion
              key={post.createdAt}
              id={post._id}
              username={post.user.username}
              userId={post.user._id}
              refreshFeed={handleFeed}
              photo={post.imageUrl}
              description={post.caption}
              Likes={post.likes ? post.likes.length : 0}
              Comments={post.comments}
            /> // Utilizamos el componente Publicacion para mostrar los posts
            //Decidimos utilizar como key el campo de createdAt ya que nos pareció el que cumple con la condición de ser unico.
            //Como aún no tenemos la funcionalidad de cargar la imagen a mongo y poder extraerla completamente, decidimos, por el momento, mostrar la url de la imágen en el feed
          ))
      ) : (
        <li>No hay publicaciones disponibles.</li> // Mensaje si no hay posts
      )}
      <PersistentDrawerLeft />
    </div>
  );
}
