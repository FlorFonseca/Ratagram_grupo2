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
  const token = localStorage.getItem("token");

  const getUserPosts = async (userData) => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/feed/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const postsData = await response.json();
        //console.log(postsData);
        if (userData) {
          const filteredPosts = postsData.filter(
            (post) => post.user._id === userData._id
          );
          setPosts(filteredPosts);
        }
      }
    } catch (error) {
      setMessage("Error en el servidor");
    }
  };

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
          setUserData(DataUser);
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

  useEffect(() => {
    if (userData) {
      getUserPosts(userData); // Cargar posts solo cuando userData esté listo
    }
  }, [userData]);


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
