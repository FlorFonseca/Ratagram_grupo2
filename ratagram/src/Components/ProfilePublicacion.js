import React from "react";
import '../styles/MyProfile.css';

const ProfilePublicacion = ({ photo, onClick }) => {
  return (
    <div className="user-publicacion" onClick={onClick}>
      <img
        src={photo.imageUrl}
        alt="Imagen de la publicación"
        className="publicacion-image"
      />
    </div>
  );
};

export default ProfilePublicacion;

