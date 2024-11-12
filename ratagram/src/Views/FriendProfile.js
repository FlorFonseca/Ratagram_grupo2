import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfilePublicacion from "../Components/ProfilePublicacion";
import { useAuth } from "../auth/AuthProvider";
import Modal from "../Components/Modal";
import Publicacion from "../Components/Publicacion";
import "../styles/MyProfile.css";
import PersistentDrawerLeft from "../Components/Drawer";

// Función para cargar detalles de comentarios
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

const FriendProfile = () => {
  const { friendId } = useParams();
  const [friendData, setFriendData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleFriendProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/user/profile/${friendId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const DataFriend = await response.json();
          setFriendData(DataFriend.user);
          setPosts(DataFriend.posts);
          setIsFriend(DataFriend.isFriend);
        }
      } catch (error) {
        console.error("Error en el servidor");
      }
    };

    if (friendId) {
      handleFriendProfile();
    }
  }, [friendId, token]);

  const handleOpenModal = (post) => {
    setSelectedPost(post);
    loadComments(post.comments);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    setComments([]);
  };

  const loadComments = async (commentIds) => {
    if (commentIds && commentIds.length > 0) {
      const commentsData = await fetchCommentsDetails(commentIds, token);
      setComments(commentsData.filter(comment => comment));
    }
  };

  const handleFriendAction = async () => {
    try {
      const action = isFriend ? "remove-friend" : "add-friend";
      const response = await fetch(
        `http://localhost:3001/api/user/${action}/${friendId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friendId }),
        }
      );

      if (response.ok) {
        setIsFriend(!isFriend);
      }
    } catch (error) {
      console.error("Error en el servidor");
    }
  };

  if (!friendData) {
    return <div>Cargando perfil del amigo...</div>;
  }

  return (
    <div className="profile-container">
      <div className="bigUserName">
        <h1>{friendData.username}</h1>
      </div>

      <div className="profile-header">
        <div className="profile-pic">
          <img src={friendData.profileImage || "img"} alt="perfil" />
        </div>

        <div className="profile-info">
          <div className="littleUserName">
            <h3>{friendData.username}</h3>
            <p>{friendData.createdAt}</p>
          </div>
        </div>

        <div className="posts-stats">
          <h5>Posts</h5>
          <p>{posts.length}</p>
        </div>

        <div className="friends-stats">
          <h5>Friends</h5>
          <p>{friendData.friends?.length}</p>
        </div>
      </div>

      <div className="profile-editBtn">
        <button onClick={handleFriendAction}>
          {isFriend ? "Eliminar amigo" : "Añadir amigo"}
        </button>
      </div>

      <div className="profile-posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <ProfilePublicacion
              key={post.id}
              id={post.id}
              photo={post.imageUrl}
              onClick={() => handleOpenModal(post)}
            />
          ))
        ) : (
          <p>No hay publicaciones</p>
        )}
      </div>

      {selectedPost && (
        <Modal onClose={handleCloseModal}>
          <div className="modal-post">
            <Publicacion
              username={friendData.username}
              id={selectedPost.id}
              photo={selectedPost.imageUrl}
              description={selectedPost.caption}
              Likes={selectedPost.likes.length}
              Comments={comments}
              isProfileView={false} 
              onDelete={null}
              refreshComments={loadComments} 
            />
          </div>
        </Modal>
      )}

      <PersistentDrawerLeft />
    </div>
  );
};

export default FriendProfile;
