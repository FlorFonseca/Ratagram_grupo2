# Ratagram_grupo2

## Propuesta
> Desarrollar una aplicación web y mobile utilizando React para la parte web y React Native para la parte móvil, con la funcionalidad básica de una red social de intercambio de imágenes, similar a Instagram. El objetivo es poner en práctica los conceptos de frontend y seguridad aprendidos durante el curso, implementando un sistema de autenticación con JWT.

## Desarrollo
Para la primer entrega del proyecto se implementaron las funcionalidades del manejo de rutas tanto privadas como públicas, el login y el registro de usuarios. Se manejaron diferentes autorizaciones y autenticaciones, para otorgar diferentes permisos tanto de acceso como de acciones para los diferentes usuarios.

## División en carpetas
`./src/auth`: En esta carpeta se encuentra el `AuthProvider`, encargado de manejar la autenticación de los usuarios.


`./src/Components`: En esta carpeta se encuentan los Componentes de "Ratagram".


`./src/routes`: En esta carpeta se encuentras el archivo `Protected`, el cual define las condiciones que se deben cumplir para acceder a determinadas rutas protegidas.


`./src/styles`: En esta carpeta se encuentran todos los archivos`.css` que le dan el estilo a las diferentes páginas y componentes.


`./src/Views`: En esta carpeta se encuentran las diferentes páginas que componen Ratagram.

## Manual de usuario

### Instalación de Librerías
` npm install jwt-decode`: Utilizamos esta librería para decodificar el token del usuario para obtener el id en AuthProvider.


`npm install @mui/material @emotion/react @emotion/styled`
`npm install @mui/icons-material`: Utilizamos MUI para darle estilo a la barra lateral que permite navegar por la aplicación y además para estilizar los botones de likes y comentarios.


### Login
Lo primero que se encuentra un usuario al ingresar a “Ratagram” es la página de `Login`. Aquí se deben rellenar los campos con un _email_ y una _password_. 
Si el usuario ya fue registrado anteriormente puede dar click en el botón de _Login_ para poder redirigirse a su _feed_, de lo contrario no se lo dejará ingresar y deberá clickear el botón _Sign Up_ y así registrarse como un nuevo usuario.

### Sign Up
En esta pantalla el usuario deberá crearse su cuenta dentro de "Ratagram". Para esto deberá rellenar los campos de _User Name_, _email_ y _password_ de acuerdo a sus preferencias. Al completar el formulario, se debe clickear el botón _Sign Up_ el cual lo redirigirá a la página de _Login_, donde deberá ingresar las credenciales de su nueva cuenta para poder acceder, por ejemplo, a su _feed_ y su _perfil_.

### Feed
Una vez validado el usuario, en el _feed_ se mostrarán las fotos que otros usuarios de "Ratagram" hayan subido.
Además se puede _likear_ o _comentar_ las publicaciones que se ven allí.

### Barra de Navegación
En el lateral izquierdo superior se encuentran tres lineas horizontales las cuales al ser clickeadas despliegan el _drawer de navegación_, el cual permitirá al usuario moverse entre las diferentes páginas de la app.

### MyProfile
Es el perfil del usuario, donde se muestra el _userName_, la _descripción_, la cantidad de _posts_ y _friends_ así como un mosaico de todos los _posts_ que ha hecho el usuario.
Al clickear una de las imágenes se abre un modal con más detalles de la publicación seleccionada.

### FriendProfile
Este es el perfil de un usuario diferente, tiene la posibilidad de poder añadirlo como amigo, así como de ver las publicaciones que el mismo ha subido.
Por el momento, la manera de acceder a un _FriendProfile_ es con la ruta `/friendProfile/:friendProfileId`, utilizando el _id_ del otro usuario.