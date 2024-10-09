# Ratagram_grupo2

## Propuesta
> Desarrollar una aplicación web y mobile utilizando React para la parte web y React Native para la parte móvil, con la funcionalidad básica de una red social de intercambio de imágenes, similar a Instagram. El objetivo es poner en práctica los conceptos de frontend y seguridad aprendidos durante el curso, implementando un sistema de autenticación con JWT.

## Desarrollo
Para la primer entrega del proyecto se implementaron las funcionalidades del manejo de rutas tanto privadas como públicas, el login y el registro de usuarios. Se manejaron diferentes autorizaciones y autenticaciones, para otorgar diferentes permisos tanto de acceso como de acciones para los diferentes usuarios.

## División en carpetas
`./src/auth`: En esta carpeta se encuentra el `AuthProvider`, encargado de manejar la autenticación de los usuarios.
`./src/routes`: En esta carpeta se encuentras los diferentes componentes que serán luego las rutas de la página. También se encuentra el archivo `Protected`, el cual define las condiciones que se deben cumplir para acceder a determinadas rutas protegidas.
`./src/styles`: En esta carpeta se encuentran todos los archivos`.css` que le dan el estilo a las diferentes páginas.

## Manual de usuario
### Login
Lo primero que se encuentra un usuario al ingresar a “Ratagram” es la página de `Login`. Aquí se deben rellenar los campos con un _email_ y una _password_. 
Si el usuario ya fue registrado anteriormente puede dar click en el botón de _Login_ para poder redirigirse a su _feed_, de lo contrario no se lo dejará ingresar y deberá clickear el botón _Sign Up_ y así registrarse como un nuevo usuario.

## Sign Up
En esta pantalla el usuario deberá crearse su cuenta dentro de Ratagram. Para esto deberá rellenar los campos de _User Name_, _email_ y _password_ de acuerdo a sus preferencias. Al completar el formulario, se debe clickear el botón _Sign Up_ el cual lo redirigirá a la página de _Login_, donde deberá ingresar las credenciales de su nueva cuenta para poder acceder, por ejemplo, a su _feed_ y su _perfil_.

## Feed
Una vez validado el usuario, en el _feed_ se mostrarán las fotos que otros usuarios de Ratagram hayan subido.


