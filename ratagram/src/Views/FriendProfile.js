/*Manejo para ver el perfil de otro usuario. Aquí manejamos la información como el nombre de usuario, foto de perfil, descripción,
 la posibilidad de añadir amigo.*/
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfilePublicacion from "../Components/ProfilePublicacion";
import { useAuth } from "../auth/AuthProvider";
import Modal from "../Components/Modal";
import Publicacion from "../Components/Publicacion";
import "../styles/MyProfile.css";

const FriendProfile = () => {
  const { friendId } = useParams();//Obtenemos el id por URL.
  const { user } = useAuth();
  const [friendData, setFriendData] = useState(null); //Se guarda la información del perfil del amigo.
  const [posts, setPosts] = useState([]); //Se guardan las fotos.
  const [isFriend, setIsFriend] = useState(false); //Es amigo ya?
  const [selectedPost, setSelectedPost] = useState(null);
  const [message, setMessage] = useState(""); //Mensaje para ver si cargó el perfil
  const token = localStorage.getItem("token");

  //Solicitud para obtener el perfil de otro usuario
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
          setIsFriend(DataFriend.isFriend); // Verificar si el usuario actual es amigo del perfil
          setMessage("Perfil del amigo cargado");
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
  }, [friendId, token]);

  const handleOpenModal = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleFriendAction = async () => {
    try {
      const action = isFriend ? "remove-friend" : "add-friend"; //Agregar o eliminar, dependiendo si ya es amigo.
      const response = await fetch(
        `http://localhost:3001/api/user/${action}/${friendId}`, //URL dinámica, segun lo que hagamos (agregar o eliminar amigo).
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
        setIsFriend(!isFriend); // Alternar el estado de amistad
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
    <div className="friend-profile-container">
      <div className="friend-profile-header">
        <img src={friendData.profileImage || "img"} alt="perfil" />
        <h1>{friendData.username}</h1>
        <p>{friendData.createdAt}</p>
        <button onClick={handleFriendAction}>
          {isFriend ? "Eliminar amigo" : "Añadir amigo"}
        </button>
      </div>

      <div className="friend-profile-stats">
        <div>
          <h5>Posts</h5>
          <p>{posts.length}</p>
        </div>
        <div>
          <h5>Amigos</h5>
          <p>{friendData.friends?.length}</p>
        </div>
      </div>

      <div className="friend-profile-posts">
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
          <Publicacion
            username={friendData.username}
            id={selectedPost.id}
            photo={selectedPost.imageUrl}
            description={selectedPost.caption}
          />
        </Modal>
      )}

      <p>{message}</p>
    </div>
  );
};

export default FriendProfile;
