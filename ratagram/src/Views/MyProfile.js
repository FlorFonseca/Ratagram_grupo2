// /*Manejo para ver el perfil del usuario ("para ver mi propio perfil")
//  */
import React, { useState, useEffect } from "react";
import ProfilePublicacion from "../Components/ProfilePublicacion";
import { useAuth } from "../auth/AuthProvider";
import Modal from "../Components/Modal";
import Publicacion from "../Components/Publicacion";
import "../styles/MyProfile.css";

const MyProfile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postsStatistics, setPostsStatistics] = useState(0);
  const [friendsStatistics, setFriendsStatistics] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:3001/api/user/profile/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener perfil");
        }
        const DataUser = await response.json();
        setMessage("Perfil cargado");
        setUserData(DataUser);
      } catch (error) {
        setMessage("Error en el servidor");
      }
    };

    const getUserPosts = async () => {
      const token = localStorage.getItem("token");
      try {
        //console.log(user.id); se está obteniendo bien el id
        const response = await fetch(
          `http://localhost:3001/api/user/posts/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          setMessage("Error al cargar las publicaciones");
          return;
        }
        const postsData = await response.json();
        //console.log(postsData);
        setPosts(postsData);
      } catch (error) {
        setMessage("Error en el servidor");
      }
    };

    if (user) {
      handleProfile();
      getUserPosts();
    }
  }, [user]);

  const handlePostStatistics = () => {
    setPostsStatistics(posts.length);
    return postsStatistics;
  };

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
          <p>5</p>
        </div>
        <div className="friends-stats">
          <h5>Friends</h5>
          <p>0</p>
        </div>
      </div>
      <div className="profile-editBtn">
        <button>EditProfile</button>
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
              username={userData?.username}
              id={selectedPost.id}
              photo={selectedPost.imageUrl}
              description={selectedPost.caption}
            ></Publicacion>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyProfile;
