import React, { useState, useEffect } from "react";
import "../styles/Publicacion.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MapsUgcRoundedIcon from "@mui/icons-material/MapsUgcRounded";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const fetchCommentsDetails = async (commentIds, token) => {
  return await Promise.all(
    (commentIds || []).map(async (commentId) => {
      if (!commentId) return null;
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

const handleLikes = async (id) => {
  try {
    const response = await fetch(`http://localhost:3001/api/posts/${id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Error al dar like");
    }
    return await response.json();
  } catch (error) {
    console.log("error en handleLikes", error);
  }
};

const handleComments = async (id, content) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/posts/${id}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content }),
      }
    );
    if (!response.ok) {
      throw new Error("Error al comentar");
    }
    return await response.json();
  } catch (error) {
    console.log("error en handleComments", error);
  }
};

const Publicacion = ({
  id,
  username,
  userId,
  photo,
  description,
  Likes,
  Comments,
  isProfileView,
  refreshFeed,
  onDelete,
  refreshComments,
}) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(Likes || 0);
  const [commentInput, setCommentInput] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadComments = async () => {
      if (Comments && Comments.length > 0) {
        if (typeof Comments[0] === "string") {
          const commentsData = await fetchCommentsDetails(Comments, token);
          setComments(commentsData.filter(comment => comment));
        } else {
          setComments(Comments);
        }
      }
    };
    loadComments();
  }, [Comments, token]);

  const handleLikeClick = async () => {
    const postData = await handleLikes(id);
    if (postData && postData.likes) {
      setLikes(postData.likes.length);
    }
  };

  const handleDeleteClick = async () => {
    if (isProfileView && onDelete) {
      onDelete(id);
    }
  };

  const profileRedirect = () => {
    if (user && userId === user.id) {
      navigate(`/myProfile`);
    } else {
      navigate(`/friendprofile/${userId}`);
    }
  };

  const handleCommentSubmit = async () => {
    if (commentInput.trim() === "") return;
    const commentPosted = await handleComments(id, commentInput);
    if (commentPosted) {
      setCommentInput("");
      if (refreshComments) {
        refreshComments();  // Llama a la función de refresco de comentarios
      } else {
        setComments((prevComments) => [...prevComments, commentPosted]); // Agrega directamente en el caso de no tener refreshComments
      }
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
        />
        <p className="publicacion-description">{description}</p>
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="Escribe un comentario..."
          className="comment-input"
        />
        {isProfileView && (
          <button onClick={handleDeleteClick}>Eliminar Publicación</button>
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

