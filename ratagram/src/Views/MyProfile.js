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
  const [friends, setFriends] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postsStatistics, setPostsStatistics] = useState(0);
  const [friendsStatistics, setFriendsStatistics] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user.id) return;
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
          setFriends(DataUser.user.friends);
          setPosts(DataUser.posts);
          setPostsStatistics(DataUser.posts.length);
          setFriendsStatistics(DataUser.user.friends.length);
          setNewUsername(DataUser.user.username);
          setNewProfilePicture(DataUser.user.profileImage);
          setNewDescription(DataUser.user.description);
          setMessage("Perfil cargado");
        }
      } catch (error) {
        setMessage("Error en el servidor");
      }
    };

    handleProfile();
  }, [user, token]);

  const handleOpenModal = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
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
        setIsEditing(false);
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
            <button className="editingBtn" onClick={handleEditProfile}>
              Save
            </button>
            <button className="editingBtn" onClick={handleEditClick}>
              Cancel
            </button>
          </>
        ) : (
          <button onClick={handleEditClick}>Edit Profile</button>
        )}
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
          <Publicacion
            id={selectedPost._id}
            username={userData?.username}
            photo={selectedPost.imageUrl}
            description={selectedPost.caption}
            Likes={selectedPost.likes.length}
            Comments={selectedPost.comments}
            onAddComment={(content) => console.log("Add comment:", content)}
          />
        </Modal>
      )}

      <PersistentDrawerLeft />
    </div>
  );
};

export default MyProfile;
