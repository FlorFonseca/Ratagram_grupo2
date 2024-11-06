/**
 * Manejo para ver el perfil del usuario, usamos el contexto creado con la autenticación, para saber que efectivamente es la cuenta del usuario
 * logueado. Aquí manejamos la información como el nombre de usuario, foto de perfil, descripción, la posibilidad de editar la foto de perfil,
 * obtener los amigos del usuario y obtener los posts que ha hecho el mismo.
 */
import React, { useState, useEffect } from "react";
import ProfilePublicacion from "../Components/ProfilePublicacion";
import { useAuth } from "../auth/AuthProvider";
import Modal from "../Components/Modal";
import Publicacion from "../Components/Publicacion";
import "../styles/MyProfile.css";
import PersistentDrawerLeft from "../Components/Drawer";

const MyProfile = () => {
  const { user } = useAuth();
  console.log("user", user);
  const [userData, setUserData] = useState(null);
  console.log("usesrData", userData);
  const [posts, setPosts] = useState([]);
  const [friend, setFriends] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postsStatistics, setPostsStatistics] = useState(0);
  const [friendsStatistics, setFriendsStatistics] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token"); //obtenemos el token del usuario, lo decodificamos con jwtDecode para poder obtener el id

  useEffect(() => {
    const handleProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/user/profile/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const DataUser = await response.json();
          setUserData(DataUser.user);
          setFriends(DataUser.user.friends); //guardamos los amigos del usuario
          setPosts(DataUser.posts); //guardamos los posts del usuario
          setPostsStatistics(DataUser.posts.length);
          setFriendsStatistics(DataUser.user.friends.length); //estas estadísticas nos dicen cuántos posts ha hecho el usuario y cuándos amigos tiene
          setNewUsername(DataUser.user.username);
          setNewProfilePicture(DataUser.user.profileImage); //estos indican los valores iniciales de username y profileimage para despues poder editarlos
          setNewDescription(DataUser.user.description);
          setMessage("Perfil cargado");
        }
      } catch (error) {
        setMessage("Error en el servidor");
      }
    };

    handleProfile();
  }, [user, token]);

  if (!user) {
    return <div>Cargando perfil...</div>;
  }

  const handleOpenModal = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing); // cambia entre vista y edición
  };

  const handleEditProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/user/profile/edit`,
        {
          method: "PUT",
          body: JSON.stringify({
            username: newUsername,
            profilePicture: newProfilePicture,
            description: newDescription,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData.user);
        setIsEditing(false); // salir del modo edición
        setMessage("Perfil actualizado con éxito");
      } else {
        setMessage("Error al actualizar el perfil");
      }
    } catch (error) {
      setMessage("Error en el servidor");
    }
  };

  return (
    <div className="profile-container">
      <div className="bigUserName">
        <h1>
          {isEditing ? (
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          ) : (
            userData?.username
          )}
        </h1>
      </div>
      <div className="profile-header">
        <div className="profile-pic">
          {isEditing ? (
            <input
              type="text"
              value={newProfilePicture}
              onChange={(e) => setNewProfilePicture(e.target.value)}
              placeholder="URL de la nueva imagen"
            />
          ) : userData?.profileImage ? (
            <img
              src={userData?.profileImage || "img"}
              alt="perfil"
              className="profile-pic-img"
            ></img>
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
                {userData?.username?.substring(0, 2).toUpperCase()}
              </text>
            </svg>
          )}
        </div>

        <div className="profile-info">
          <div className="littleUserName">
            <h3>{userData?.username}</h3>
          </div>
          <div className="description">
            {isEditing ? (
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Descripción"
              />
            ) : (
              <p>{userData?.description}</p>
            )}
          </div>
        </div>
        <div className="profile-stats">
          <div>
            <h5>Posts</h5>
            <p>{postsStatistics}</p>
          </div>
          <div>
            <h5>Friends</h5>
            <p>{friendsStatistics}</p>
          </div>
        </div>
      </div>
      <div className="profile-editBtn">
        {isEditing ? (
          <>
            <button className="editingBtn" onClick={handleEditProfile}>Save</button>
            <button className="editingBtn" onClick={handleEditClick}>Cancel</button>
          </>
        ) : (
          <button onClick={handleEditClick}>Edit Profile</button>
        )}
      </div>
      {/* ProfilePublicacion es un tipo de publicación que solo está en el perfil, solo muestra las imágenes que ha subido el usuario */}
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
      {/* En este modal, al hacer click en la ProfilePublicacion, se muestra la publicacion del usuario por completo */}
      {selectedPost && (
        <Modal onClose={handleCloseModal}>
          <div className="modal-post">
            <Publicacion
              username={userData?.username}
              id={selectedPost.id}
              photo={selectedPost.imageUrl}
              description={selectedPost.caption}
              Likes={selectedPost.likes.length}
              Comments={selectedPost.comments}
            ></Publicacion>
          </div>
        </Modal>
      )}
      <PersistentDrawerLeft />
    </div>
  );
};

export default MyProfile;
