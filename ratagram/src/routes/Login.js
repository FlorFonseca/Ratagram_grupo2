import React, { useState } from "react";
//import DefaultLayout from "../layout/DefaultLayout";


export default function Login() {
    const [email, setEmail] = useState(''); // Capturar email o username
    const [password, setPassword] = useState(''); // Capturar password
    const [message, setMessage] = useState(''); // Para mostrar mensajes de error o éxito

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
                // Aquí podrías redirigir al usuario a otra página, como el dashboard
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

    return (
        // <DefaultLayout>
            <form className="form" onSubmit={handleLogin}>
                <h1>Login</h1>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Actualiza el estado del email
                    required
                />
                
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Actualiza el estado del password
                    required
                />
                
                <button type="submit">Login</button>
                <button>SignUp</button>

                {message && <p>{message}</p>} {/* Muestra el mensaje */}
            </form>
        // </DefaultLayout>
    );
}
