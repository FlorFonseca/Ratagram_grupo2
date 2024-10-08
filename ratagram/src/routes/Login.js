import React, { useState } from "react";
import { useAuth } from '../auth/AuthProvider'; // Si tienes un contexto para manejar autenticación
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import './Login&SignUp.css';


export default function Login() {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth(); // Asegúrate de manejar el estado global de autenticación

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validación rápida de los campos
        if (!email || !password) {
            setMessage('Todos los campos son obligatorios.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), 
            });

            const data = await response.json();

            if (response.ok) {
                // Guardamos el token JWT en localStorage
                localStorage.setItem('token', data.token);

                // Actualizamos el estado de autenticación si tienes un contexto
                setIsAuthenticated(true);

                setMessage('Login exitoso');
                
                // Redirigir al feed
                navigate('/myfeed');
            } else {
                // Mostrar el mensaje de error del backend
                setMessage(data.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            setMessage('Error en el servidor');
            console.error('Error en la autenticación:', error);
        }
    };

    const goToSignUp = () => {
        navigate('/signup');
    };

    return (
        <form className="form" onSubmit={handleLogin}>
            <h1 className="titulo">Ratagram </h1>
            <label className="Labels">Email</label>
            <input
                className="inputLandS"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <label className="Labels">Password</label>
            <input
                className="inputLandS"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required

            />

            <div className="LoginButtonSection">
                <div className="group1">
                    <button className="LoginandSignUp-btn" type="submit">Login</button>
                    <button className="LoginandSignUp-btn" onClick={goToSignUp}>Sign Up</button>
                </div>
            </div>


            {message && <p>{message}</p>} {/* Mostrar el mensaje */}
        </form>
    );
}
