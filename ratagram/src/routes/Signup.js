import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import './Login&SignUp.css';

export default function Signup() {
    const [email, setEmail] = useState(''); // Capturar email
    const [username, setUserName] = useState(''); // Capturar username
    const [password, setPassword] = useState(''); // Capturar password
    const [message, setMessage] = useState(''); // Para mostrar mensajes de error o éxito
    const navigate = useNavigate(); // Creamos navigate para redirigir entre rutas

    // Función que se ejecuta cuando se envía el formulario
    const handleSignUp = async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        try {
            // Realizamos la solicitud al backend
            const response = await fetch('http://localhost:3000/api/auth/register', { // Cambia la URL según sea necesario
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }), // Enviamos los datos del formulario
            });

            const data = await response.json();

            if (response.ok) {
                // Si el registro fue exitoso
                setMessage('Registro exitoso');
                navigate('/'); // Redirigir al login después del registro exitoso
            } else {
                // Si el registro falló, mostramos el mensaje de error del backend
                setMessage(data.message || 'Error en el registro');
            }
        } catch (error) {
            // Si hubo un error en la solicitud
            setMessage('Error en el servidor');
            console.error('Error en el registro:', error);
        }
    };

    return (
        <form className="form" onSubmit={handleSignUp}>
            <h1 className="titulo">Sign Up</h1>
            <label className="Labels">Email</label>
            <input
                className="inputLandS"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Actualiza el estado del email
                required
            />

            <label className="Labels">User Name</label>
            <input
                className="inputLandS"
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)} // Actualiza el estado del userName
                required
            />

            <label className="Labels">Password</label>
            <input
                className="inputLandS"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Actualiza el estado del password
                required
            />

            <div className="LoginButtonSection">
                <div className="group1">
                    <button className="LoginandSignUp-btn" type="submit">Registrar</button>
                </div>
            </div>
            {message && <p>{message}</p>} {/* Muestra el mensaje */}
        </form>
    );
}
