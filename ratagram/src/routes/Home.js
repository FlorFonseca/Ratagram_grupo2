import React, { useState, useEffect } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);  // Inicializamos como un array vacío
  const [error, setError] = useState(null);  // Estado para manejar errores

  // useEffect para obtener las publicaciones cuando el componente se monta
  useEffect(() => {
    fetch("http://localhost:3000/api/posts/feed")  // URL actualizada
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);  // Verifica la respuesta que llega del backend
        if (Array.isArray(data)) {
          setPosts(data);  // Si la respuesta es un array, lo asignamos a posts
        } else {
          setError("La respuesta del servidor no es un array");
        }
      })
      .catch((error) => setError("Error al obtener las publicaciones: " + error.message));
  }, []);

  // Si hay un error, mostramos el mensaje
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="home-container">
      <h1>Feed de Publicaciones</h1>

      {/* Si el array está vacío, mostramos un mensaje */}
      {posts.length === 0 ? (
        <p>No hay publicaciones para mostrar</p>
      ) : (
        <div className="feed">
          {posts.map((post) => (
            <div key={post._id} className="post">
              <h3>{post.user.username}</h3>
              <img
                src={`http://localhost:3000/${post.imageUrl}`} // Cambia la URL según sea necesario
                alt="Post"
                className="post-image"
              />
              <p>{post.caption}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
