/*Manejo para ver y guardar los posts que hace un usuario, estos se deberán mostrar en MyProfile
*/
import React from "react";
import "../styles/Publicacion.css";
import { useNavigate } from "react-router-dom";

const deletePublicacion = async (id) => {
  const publicacionDelete = await fetch("http://localhost:3001/api/posts/${id}", {
    method: "DELETE",
  });

  return publicacionDelete;
};

const Publicacion = ({ username, id, refreshFeed, photo, description  }) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/details/${id}`);
  };

  const handleDeleteClick = async () => {
    const response = await deletePublicacion(id);
    if (response.ok) {
      refreshFeed();
    }
  };

  return (
    <div className="Publicacion">
      <div className="publicacion-content">
        <h2 className="publicacion-title">{username}</h2>
        <img className="publicacion-photo" src={photo} style={{ width: 250 }} alt="photo"></img>
        <p className="publicacion-description">{description}</p>
        <div className="publicacion-wrapp-buttons">
          <button className="publicacion-button" onClick={handleDetailsClick}>
            Detalle
          </button>
          <button className="publicacion-button" onClick={handleDeleteClick}>
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
};
export default Publicacion;
