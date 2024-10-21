/**
 * En SignUp manejamos todo lo que tiene que ver con el registro desde cero de un usuario.
 * A esta página es redirigido aquel usuario que no esté logueado y, por lo tanto, no esté autenticado ni tenga autorizaciones para utilizar Rataggram.
 * Es acá donde creamos nuevos usuarios y los almacenamos en la db de MongoDb
 */
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/Login&SignUp.css';

export default function Signup() {
    const [email, setEmail] = useState(''); 
    const [username, setUserName] = useState(''); 
    const [password, setPassword] = useState(''); // Hasta acá utilizamos estos tres useStates para poder manejar el estado de los inputs de email, userName y password 
    const [message, setMessage] = useState(''); //creamos un mensaje ya sea para indicar un SignUp exitoso o algún error
    const navigate = useNavigate(); // navigate nos permitirá poder redireccionar la página a la ruta que sea necesaria en el momento

    // Función para manejar el Registro (Sign Up)
    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            //Acá esperamos la respuesta del backend al hacerle un post con la información necesaria para crear el usuario
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }), // Enviamos los datos que se obtienen de los inputs
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Registro exitoso');
                navigate('/'); // Redirigir al login después de haber creado la cuenta de manera exitosa
            } else {
                // Si el registro falló, mostramos el mensaje de error del backend
                setMessage(data.message || 'Error en el registro');
            }
        } catch (error) {
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
                onChange={(e) => setPassword(e.target.value)} // Actualiza el estado de la password
                required
            />

            <div className="LoginButtonSection">
                <div className="group1">
                    {/* Cuando se presiona se registra al usuario en la db */}
                    <button className="LoginandSignUp-btn" type="submit">Registrar</button>
                </div>
            </div>
            {message && <p>{message}</p>} {/* Muestra el mensaje */}
        </form>
    );
}
