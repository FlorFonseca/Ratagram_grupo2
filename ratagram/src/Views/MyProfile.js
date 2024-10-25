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
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friend, setFriends] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postsStatistics, setPostsStatistics] = useState(0);
  const [friendsStatistics, setFriendsStatistics] = useState(0);
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
          setMessage("Perfil cargado");
        }
      } catch (error) {
        setMessage("Error en el servidor");
      }
    };

    if (user) {
      handleProfile();
    }
  }, [user, token]);

  const handleOpenModal = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  if (!user) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="profile-container">
      <div className="bigUserName">
        <h1>{userData?.username}</h1>
      </div>
      <div className="profile-header">
        <div className="profile-pic">
          <img src={userData?.profileImage || "img"} alt="perfil"></img>
        </div>
        <div className="profile-info">
          <div className="littleUserName">
            <h3>{userData?.username}</h3>
            <p>{userData?.createdAt}</p>
          </div>
        </div>

        <div className="posts-stats">
          <h5>Posts</h5>
          <p>{postsStatistics}</p>
        </div>
        <div className="friends-stats">
          <h5>Friends</h5>
          <p>{friendsStatistics}</p>
        </div>
      </div>
      <div className="profile-editBtn">
        <button>EditProfile</button>
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
            ></Publicacion>
          </div>
        </Modal>
      )}
      <PersistentDrawerLeft />
    </div>
  );
};

export default MyProfile;
