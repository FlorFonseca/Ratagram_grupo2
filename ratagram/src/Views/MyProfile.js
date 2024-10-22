// /*Manejo para ver el perfil del usuario ("para ver mi propio perfil")
//  */
import React, { useState, useEffect } from "react";
import Publicacion from "../Components/Publicacion";
import { useAuth } from "../auth/AuthProvider";

const MyProfile = () => {
  const {user} = useAuth();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const handleProfile = async () => {
        const token = localStorage.getItem('token');
      try{
            const response = await fetch(
              `http://localhost:3001/api/user/profile/${user.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if(!response.ok){
                throw new Error("Error al obtener perfil");
            }
            const DataUser= await response.json();
            setMessage('Perfil cargado');
            setUserData(DataUser);
        }catch(error){
            setMessage("Error en el servidor");
        }
    };

    const getUserPosts = async () => {
      const token =localStorage.getItem('token');
      try {
        //console.log(user.id); se está obteniendo bien el id
        const response = await fetch(
          `http://localhost:3001/api/user/posts/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        if (!response.ok) {
          setMessage("Error al cargar las publicaciones");
          return;
        }
        const postsData = await response.json();
        console.log(postsData);
        setPosts(postsData);
      } catch (error) {
        setMessage("Error en el servidor");
      }
    };

    if(user){
    handleProfile();
    getUserPosts();
    }

  },[user]);

  if (!user) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="bigUserName">
          <h1>{userData?.username}</h1>
        </div>
        <div className="profile-pic">
          <img src={userData?.profileImage || "img"} alt="perfil"></img>
        </div>
        <div className="stats">Statistic1</div>
        <div className="stats">Statistic2</div>
        <div className="littleUserName">
          <h3>{userData?.username}</h3>
          <p>{userData?.createdAt}</p>
        </div>
      </div>
      <div className="profile-editBtn">
        <button>EditProfile</button>
      </div>
      <div className="profile-posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Publicacion
              key={post.id}
              username={userData?.username}
              id={post.id}
              photo={post.imageUrl}
              description={post.description}
              refreshFeed={() =>
                setPosts(posts.filter((p) => p.id !== post.id))
              }
            />
          ))
        ) : (
          <p>No hay publicaciones</p>
        )}
      </div>
    </div>
  );
};

export default MyProfile;