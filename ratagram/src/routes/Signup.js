import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [email, setEmail] = useState(''); // Capturar email
    const [username, setUserName] = useState(''); // Capturar username
    const [password, setPassword] = useState(''); // Capturar password
    const [message, setMessage] = useState(''); // Para mostrar mensajes de error o éxito
    // const navigate = useNavigate(); // Para navegar entre rutas

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
                // Redirigir al login después del registro exitoso
                // navigate('/login');
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

    // const goToLogin = () => {
    //     // Redirige a la página de Log In
    //     navigate('/login');
    // };

    return (
        <form className="form" onSubmit={handleSignUp}>
            <h1>Sign Up</h1>
            <label>Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Actualiza el estado del email
                required
            />

            <label>User Name</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)} // Actualiza el estado del userName
                required
            />

            <label>Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Actualiza el estado del password
                required
            />

            <button type="submit">Registrar</button>

            {/* <button type="button" onClick={goToLogin}>Volver al Log In</button> */}

            {message && <p>{message}</p>} {/* Muestra el mensaje */}
        </form>
    );
}
