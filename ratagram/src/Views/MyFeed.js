import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FeedStyle.css";
import Publicacion from "../Components/Publicacion";
import PersistentDrawerLeft from "../Components/Drawer";
import { useAuth } from "../auth/AuthProvider";

export default function MyFeed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const { user: currentUser } = useAuth();

  const handleFeed = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/posts/feed", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPosts(data || []);
      } else {
        setMessage(data.message || "Error al cargar el feed");
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    } catch (error) {
      setMessage("Error en el servidor");
      console.error("Error al cargar el feed: ", error);
    }
  };

  useEffect(() => {
    handleFeed();
  }, []);

  return (
    <div className="feedRatagram">
      <h1 className="titulo"></h1>
      {message && <p>{message}</p>}
      {posts && posts.length > 0 ? (
        posts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
            />
          ))
      ) : (
        <li>No hay publicaciones disponibles.</li>
      )}
      <PersistentDrawerLeft />
    </div>
  );
}

