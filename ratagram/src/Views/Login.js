/**
 * Manejo del login de un usuario a la red social de Ratagram. 
 * De manera general, en este archivo se maneja el inicio de sesión de un usuario ya registrado,
 * permitiendole acceder ya sea a su feed, los perfiles de otros usuarios o el suyo propio.
 * Para esto se chequea que el usuario ya existe registrado en la base de datos y se le da permiso para acceder a 
 * las diferentes rutas privadas.
 */

import React, { useState } from "react";
import { useAuth } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import '../styles/Login&SignUp.css';


export default function Login() {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');//Hasta este punto, creamos dos useStates para manejar los estados de los inputs en el login
    const [message, setMessage] = useState(''); //creamos un mensaje ya sea para indicar un login exitoso o algún error
    const navigate = useNavigate();// navigate nos permitirá poder redireccionar la página a la ruta que sea necesaria en el momento
    const { setIsAuthenticated } = useAuth(); // Aquí vamos a manejar la autenticación del usuario cuando se loguee

    //Funcion para manejar el login
    const handleLogin = async (e) => {
        e.preventDefault();

        // Validamos que los campos de email y password no sean vacíos 
        if (!email || !password) {
            setMessage('Todos los campos son obligatorios.');
            return;
        }

        try {
            //Acá esperamos la respuesta del backend al hacerle un post con la información del usuario ingresada.
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), 
            });

            const data = await response.json(); //"data" es la respuesta que obtenemos de la base de datos y del fetch anterior

            if (response.ok) {
                // Guardamos el token en localStorage
                localStorage.setItem('token', data.token);
                // Actualizamos el estado de autenticación
                setIsAuthenticated(true);
                //Mostramos un mensaje indicando que todo salió bien y nuestro usuario ya existía en la db.
                setMessage('Login exitoso');
                // Redirigimos al usuario a su feed
                navigate('/myfeed');
            } else {
                // Si la respuesta no es ok, entonces quiere decir que ese usuario no está creado, por lo tanto 
                //1. el usuario debe crearse una cuenta nueva y registrarse o 2. debe chequear los datos ingresados
                setMessage(data.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            setMessage('Error en el servidor');
            console.error('Error en la autenticación:', error);
        }
    };

    //Esta función la utilizamos para redirigir al usuario a registrarse al apretar el botón Sign Up, esto indica que
    //el usuario no existe en la db y, por lo tanto, debe crearse una cuenta.
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
                onChange={(e) => setEmail(e.target.value)} //Actualiza el estado del email
                required
            />

            <label className="Labels">Password</label>
            <input
                className="inputLandS"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} //Actualiza el estado de la password
                required

            />
            <div className="LoginButtonSection">
                <div className="group1">
                    {/* Cuando se presiona se hace el handleLogin */}
                    <button className="LoginandSignUp-btn" type="submit">Login</button> 
                    {/* Cuando se presiona se redirige al Sign Up */}
                    <button className="LoginandSignUp-btn" onClick={goToSignUp}>Sign Up</button>
                </div>
            </div>


            {message && <p>{message}</p>} {/* Mostrar el mensaje */}
        </form>
    );
}
