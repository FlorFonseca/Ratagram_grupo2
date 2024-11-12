import React, { useState, useEffect } from "react";
import "../styles/Publicacion.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MapsUgcRoundedIcon from "@mui/icons-material/MapsUgcRounded";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";


// Función para cargar detalles de comentarios a partir de un arreglo de IDs
const fetchCommentsDetails = async (commentIds, token) => {
  return await Promise.all(
    (commentIds || []).map(async (commentId) => {
      if (!commentId) return null; // Ignorar IDs no válidos
      const response = await fetch(`http://localhost:3001/api/posts/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        return await response.json();
      }
      return { _id: commentId, user: { username: "Usuario desconocido" }, content: "Comentario no disponible" };
    })
  );
};


const Publicacion = ({ id, username, photo, description, Likes, Comments, isProfileView, onDelete }) => {
  const [likes, setLikes] = useState(Likes || 0);
  const [commentInput, setCommentInput] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadComments = async () => {
      if (Comments && Comments.length > 0) {
        // Si los comentarios son IDs, los cargamos con fetchCommentsDetails
        if (typeof Comments[0] === "string") {
          const commentsData = await fetchCommentsDetails(Comments, token);
          setComments(commentsData.filter(comment => comment)); // Filtramos comentarios nulos
        } else {
          // Si ya vienen como objetos completos, los asignamos directamente
          setComments(Comments);
        }
      }
    };
    loadComments();
  }, [Comments, token]);


  //Manejador para eliminar una publicación:
  const handleDeleteClick = async () => {
    if (isProfileView && onDelete) {
      onDelete(id); //Se puede llamar a la función de eliminación si estamos en la vista del perfil.
    }
  };


  const handleLikeClick = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const postData = await response.json();
        setLikes(postData.likes.length);
      } else {
        throw new Error("Error al dar like");
      }
    } catch (error) {
      console.error("Error en handleLikes:", error);
    }
  };


  const handleCommentSubmit = async () => {
    if (commentInput.trim() === "") return;
  
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentInput }),
      });
  
      if (response.ok) {
        const commentData = await response.json();
  
        // Fetch para obtener los detalles completos del comentario, incluyendo el usuario
        const fullCommentResponse = await fetch(
          `http://localhost:3001/api/posts/comments/${commentData._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (fullCommentResponse.ok) {
          const fullCommentData = await fullCommentResponse.json();
          setComments((prevComments) => [...prevComments, fullCommentData]);
          setCommentInput("");
        } else {
          console.error("Error al obtener los detalles del comentario");
        }
      } else {
        console.error("Error al crear el comentario");
      }
    } catch (error) {
      console.error("Error en handleCommentSubmit:", error);
      }
  }; 

  
  const profileRedirect = () => {
    if (user && userId === user.id) {
      navigate(`/myProfile`);
    } else {
      navigate(`/friendprofile/${userId}`);
    }
  };


  
  return (
    <div className="Publicacion">
      <div className="publicacion-content">

        <button className="publicacion-like-button" onClick={profileRedirect}>
          {username}
        </button>
        <img
          className="publicacion-photo"
          src={photo}
          style={{ width: 250 }}
          alt="photo"
        ></img>

        <p className="publicacion-description">{description}</p>

        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="Escribe un comentario..."
          className="comment-input"
        />

        {isProfileView && onDelete && (
          <button onClick={() => onDelete(id)}>Eliminar Publicación</button>
        )}

        <p className="verComentarios" onClick={() => setShowComments(!showComments)}>
          {showComments ? "Ver menos" : "Ver más"}
        </p>

        {showComments && (
          <div className="publicacion-comentarios">
            {comments.map((comment) => (
              <div key={comment._id} className="comment">

                <p>
                  @{comment.user && comment.user.username ? comment.user.username : "Usuario desconocido"}: {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="publicacion-wrapp-buttons">
          <button className="publicacion-like-button" onClick={handleLikeClick}>
            <FavoriteBorderIcon /> {likes}
          </button>
          <button
            className="publicacion-comment-button"
            onClick={handleCommentSubmit}
          >
            <MapsUgcRoundedIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Publicacion;
