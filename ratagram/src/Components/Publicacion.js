/*Manejo para ver y guardar los posts que hace un usuario, estos se deberán mostrar en MyProfile
 */
import React from "react";
import "../styles/Publicacion.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MapsUgcRoundedIcon from "@mui/icons-material/MapsUgcRounded";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

// const deletePublicacion = async (id) => {
//   const publicacionDelete = await fetch(`http://localhost:3001/api/posts/${id}`, {
//     method: "DELETE",
//   });

//   return publicacionDelete;
// };

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
    console.log("error en handlelikes");
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

//Le pasamos como prop isProfileView para saber si es una foto de nuestro perfil, esto nos sirve para poder tener permiso para borrarla.
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
}) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(Likes || 0);
  const [commentInput, setCommentInput] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(Comments);
  const navigate = useNavigate();

  //Manejador para eliminar una publicación:
  const handleDeleteClick = async () => {
    if (isProfileView && onDelete) {
      onDelete(id); //Se puede llamar a la función de eliminación si estamos en la vista del perfil.
    }
  };

  const handleLikeClick = async () => {
    const postData = await handleLikes(id);
    if (postData && postData.likes) {
      setLikes(postData.likes.length);
    }
  };

  const profileRedirect = () => {
    if (user && userId === user.id) {
      navigate(`/myProfile`);
    } else {
      navigate(`/friendprofile/${userId}`);
    }
  };

  const handleCommentsClick = async () => {
    if (!commentInput.trim()) {
      //para que no acepte comentarios vacíos
      return;
    }
    const commentPosted = await handleComments(id, commentInput);
    if (commentPosted) {
      setComments([...comments, commentPosted]);
      setCommentInput("");
    }
  };

  const toShowComments = async () => {
    setShowComments(!showComments);
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
        <div className="publicacion-comment-section">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Escribe un comentario..."
            className="comment-input"
          />
        </div>
        {isProfileView && (
          <button onClick={handleDeleteClick}>Eliminar Publicación.</button>
        )}
        <p className="verComentarios" onClick={toShowComments}>
          {showComments ? "Ver menos" : "Ver más"}
        </p>
        {showComments && (
          <div className="publicacion-comentarios">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <p>
                  @{comment.user}: {comment.content}
                </p>

                {/**En este caso, como no podemos acceder al username de user, dejamos el id, lo ideal sería poder acceder alnombre de usuario de quién hace el comentario */}
              </div>
            ))}
          </div>
        )}
        <div className="publicacion-wrapp-buttons">
          <button className="publicacion-like-button" onClick={handleLikeClick}>
            <FavoriteBorderIcon /> {likes}
            {/*Para mostrar la cantidad de likes de la publicación*/}
          </button>
          <button
            className="publicacion-comment-button"
            onClick={handleCommentsClick}
          >
            <MapsUgcRoundedIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Publicacion;
