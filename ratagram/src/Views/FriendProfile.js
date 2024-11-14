import React, { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import ProfilePublicacion from "../Components/ProfilePublicacion";
import Modal from "../Components/Modal";
import Publicacion from "../Components/Publicacion";
import "../styles/MyProfile.css";
import PersistentDrawerLeft from "../Components/Drawer";

const FriendProfile = () => {
  const { friendId } = useParams();
  const { user } = useAuth();
  const [friendData, setFriendData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [message, setMessage] = useState("");
  const [friendshipButton, setFriendshipButton] = useState("");
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
          setMessage("Perfil del amigo cargado");

          // Después de cargar los datos, actualizamos el texto del botón
        } else {
          setMessage("Error al cargar el perfil del amigo");
        }
      } catch (error) {
        setMessage("Error en el servidor");
      }
    };

    if (friendId) {
      handleFriendProfile();
    }
  }, [friendId, token, user]);

  useEffect(() => {
    if (friendData) {
      setIsFriend(friendData.friends.some((friend) => friend._id === user.id));
    } // Verifica si el usuario es amigo
  }, [friendData]);

  useEffect(() => {
    // Este efecto se ejecuta cada vez que `isFriend` cambia
    if (isFriend) {
      setFriendshipButton("Eliminar amigo");
    } else {
      setFriendshipButton("Añadir amigo");
    }
  }, [isFriend]);
  // console.log(isFriend);

  const handleOpenModal = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleFriendAction = async () => {
    try {
      const action = isFriend ? "remove-friend" : "add-friend";
      const method = isFriend ? "DELETE" : "POST";
      const response = await fetch(
        `http://localhost:3001/api/user/${action}/${friendId}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friendId }),
        }
      );

      if (response.ok) {
        setIsFriend(!isFriend); // Alterna el estado de amistad
        setMessage(
          isFriend
            ? "Amigo eliminado con éxito"
            : "Solicitud de amistad enviada"
        );
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Error al gestionar la amistad");
      }
    } catch (error) {
      setMessage("Error en el servidor");
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
          {friendData.profileImage ? (
            <img
              src={`http://localhost:3001/${friendData?.profileImage}` || "img"}
              alt="perfil"
              className="profile-pic-img"
            />
          ) : (
            <svg
              className="default-profile-pic"
              width="100"
              height="100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="#007bff" />
              <text
                x="50%"
                y="50%"
                dy=".35em"
                textAnchor="middle"
                fontSize="40"
                fill="white"
                fontFamily="Arial"
              >
                {friendData.username.substring(0, 2).toUpperCase()}
              </text>
            </svg>
          )}
        </div>

        <div className="profile-info">
          <div className="littleUserName">
            <h3>{friendData.username}</h3>
          </div>
          <div className="description">
            <p>{friendData.description}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div>
            <h5>Posts</h5>
            <p>{posts.length}</p>
          </div>
          <div>
            <h5>Friends</h5>
            <p>{friendData.friends.length}</p>
          </div>
        </div>
      </div>

      <div className="profile-editBtn">
        <button className="editingBtn" onClick={handleFriendAction}>
          {friendshipButton}
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
            />
          </div>
        </Modal>
      )}

      <p>{message}</p>
      <PersistentDrawerLeft />
    </div>
  );
};

export default FriendProfile;
