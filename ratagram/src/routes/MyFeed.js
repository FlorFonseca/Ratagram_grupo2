import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate

export default function MyFeed() {
    const navigate = useNavigate(); // Creamos navigate para redirigir entre rutas
    const [posts, setPosts] = useState([]); // Estado para almacenar los posts
    const [message, setMessage] = useState(''); // Para mostrar mensajes de error o éxito

    // Función para obtener los posts del feed
    const handleFeed = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/posts/feed', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Asegúrate de incluir el token
                }
            });

            const data = await response.json();
            console.log(data); // Verifica la respuesta de la API

            if (response.ok) {
                setPosts(data.posts || []); // Asegúrate de que `data.posts` tenga un valor
                setMessage('Feed cargado exitosamente');
            } else {
                setMessage(data.message || 'Error al cargar el feed');
                // Si la respuesta indica que no está autorizado, puedes redirigir al login
                if (response.status === 401) {
                    localStorage.removeItem('token'); // Elimina el token si no está autorizado
                    navigate('/login'); // Redirige al login
                }
            }
        } catch (error) {
            setMessage('Error en el servidor');
            console.error('Error en la carga del feed:', error);
        }
    };

    useEffect(() => {
        handleFeed(); // Cargar los posts al montar el componente
    }, []);

    return (
        <div className="feedRatagram">
            <h1 className="titulo">Feed</h1>
            {message && <p>{message}</p>} {/* Muestra el mensaje */}
            <ul>
                {posts && posts.length > 0 ? (
                    posts.map((post, index) => (
                        <li key={index}>{post.content}</li> // Cambia 'content' según la estructura de tus posts
                    ))
                ) : (
                    <li>No hay publicaciones disponibles.</li> // Mensaje si no hay posts
                )}
            </ul>
        </div>
    );
}
