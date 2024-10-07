import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import './Login&SignUp.css';

export default function Login() {
    const [email, setEmail] = useState(''); // Capturar email o username
    const [password, setPassword] = useState(''); // Capturar password
    const [message, setMessage] = useState(''); // Para mostrar mensajes de error o éxito
    const navigate = useNavigate(); // Creamos navigate para redirigir entre rutas

    // Función que se ejecuta cuando se envía el formulario
    const handleLogin = async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        try {
            // Realizamos la solicitud al backend
            const response = await fetch('http://localhost:3000/api/auth/login', { // Cambia la URL según sea necesario
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), // Enviamos los datos del formulario
            });

            const data = await response.json();

            if (response.ok) {
                // Si el login fue exitoso
                localStorage.setItem('token', data.token); // Guardamos el token JWT
                setMessage('Login exitoso');
                navigate('/myfeed'); // Redirigir a una ruta protegida después de iniciar sesión
            } else {
                // Si el login falló, mostramos el mensaje de error del backend
                setMessage(data.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            // Si hubo un error en la solicitud
            setMessage('Error en el servidor');
            console.error('Error en la autenticación:', error);
        }
    };
    const goToSignUp = () => {
        navigate('/signup'); // Aquí es donde se realiza la navegación a /signup
    };

    return (
        <form className="form" onSubmit={handleLogin}>
            <h1 className="titulo">Ratagram </h1>
            <label className="Labels">Email</label>
            <input
                className="inputLandS"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Actualiza el estado del email
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
                    <button className="LoginandSignUp-btn" type="submit">Login</button>
                    <button className="LoginandSignUp-btn" onClick={goToSignUp}>Sign Up</button>
                </div>
            </div>


            {message && <p>{message}</p>} {/* Muestra el mensaje */}
        </form>
    );
}
