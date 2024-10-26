/*Manejo para ver y guardar los posts que hace un usuario, estos se deberán mostrar en MyProfile
 */
import React from "react";
import "../styles/Publicacion.css";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MapsUgcRoundedIcon from "@mui/icons-material/MapsUgcRounded";
import { useState } from "react";


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

const Publicacion = ({
  username,
  id,
  refreshFeed,
  photo,
  description,
  Likes,
}) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(Likes || 0);
  const [commentInput, setCommentInput] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState("");

  const handleLikeClick = async () => {
    const postData = await handleLikes(id);
    if (postData && postData.likes) {
      setLikes(postData.likes.length);
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

  const toShowComments = async() =>{
    if(!showComments){
      const comments = await handleComments(id);
      setComments(comments);
    }
    setShowComments(!showComments);
  };


  return (
    <div className="Publicacion">
      <div className="publicacion-content">
        <h2 className="publicacion-title">{username}</h2>
        <img
          className="publicacion-photo"
          src={photo}
          style={{ width: 250 }}
          alt="photo"
        ></img>
        <p className="publicacion-description">{description}</p>
        <div className="publicacion-wrapp-buttons">
          <button className="publicacion-like-button" onClick={handleLikeClick}>
            <FavoriteBorderIcon /> {likes}
            {/*Para mostrar la cantidad de likes de la publicación*/}
          </button>
        </div>
        <div className="publicacion-comment-section">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Escribe un comentario..."
            className="comment-input"
          />
        </div>
        <p className="verComentarios" onClick={toShowComments}>
          {showComments ? "Ver menos" : "Ver más"}
        </p>
        {showComments && (
          <div className="publicacion-comentarios">
            {comments.map((comment)=>(
              <div key={comment._id} className="comment">
                <strong>@{comment.user.username}: </strong> {comment.content}
              </div>
            ))}
          </div>
        )}
        <button
          className="publicacion-comment-button"
          onClick={handleCommentsClick}
        >
          <MapsUgcRoundedIcon />
        </button>
      </div>
    </div>
  );
};
export default Publicacion;
