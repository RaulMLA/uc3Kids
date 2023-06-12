const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');

// Sockets del visualizador y del controlador.
let visSocket;
let ctrlSocket;

// Indica si el controlador está conectado.
let isCtrlConnected = false;

// Usuario actual que ha iniciado sesión.
let usuarioActual;

// Video en reproducción
let videoActual;

app.use('/', express.static(path.join(__dirname, 'www')));
app.use('/viz', express.static(path.join(__dirname)));
app.use('/controller', express.static(path.join(__dirname)));

app.use('/videos', express.static(path.join(__dirname, 'viz', 'src', 'videos')));


io.on('connection', (socket) => {
    //console.log(`\nSocket connected ${socket.id}`);

    socket.on("MAIN_CONNECTED", () => {
        console.log("MAIN_CONNECTED");
        visSocket = socket;
    });


    socket.on("CTRL_LOGGED", () => {
        console.log("CTRL_LOGGED");
        ctrlSocket = socket;

        if (visSocket) visSocket.emit("CTRL_LOGGED");
    });


    socket.on("VIS_LOGGED", () => {
        console.log("VIS_LOGGED");
        visSocket = socket;
    });


    socket.on("VIS_CONNECTED", () => {
        console.log("VIS_CONNECTED");
        visSocket = socket;
    });


    socket.on("CTRL_CONNECTED", () => {
        console.log("CTRL_CONNECTED");
        ctrlSocket = socket;
        isCtrlConnected = true;

        if (visSocket) visSocket.emit("CTRL_CONNECTED");
    });


    socket.on("CP_VIS_CONNECTED", () => {
        console.log("CP_VIS_CONNECETED");
        visSocket = socket;

        if (ctrlSocket) ctrlSocket.emit("CP_VIS_CONNECTED");
    });


    socket.on("CTRL_CP_LOGGED", () => {
        console.log("CP_CTRL_CONNECTED");
        if (visSocket) visSocket.emit("CTRL_CP_LOGGED");
    });

    socket.on("SALIR_CTRL", () =>{
        console.log("SALIR_CTRL");
        if (visSocket) visSocket.emit("SALIR_CTRL");      
    });

    socket.on("LOGIN_CONTROL_PARENTAL", (password) => {
        console.log("LOGIN_CONTROL_PARENTAL");

        ctrlSocket = socket;

        // Leemos el archivo usuarios.json y parseamos su contenido
        const usuariosJSON = fs.readFileSync("usuarios.json");
        const usuarios = JSON.parse(usuariosJSON);

        // Buscamos el usuario actual en el array de usuarios
        const usuario = usuarios.find(user => user.usuario === usuarioActual);

        // Si el usuario existe y la contraseña es correcta, enviamos un mensaje de OK al controlador
        if (usuario && usuario.password === password) {
            ctrlSocket.emit("LOGIN_CONTROL_PARENTAL", "OK");
        } else {
            // Si la contraseña es incorrecta, enviamos un mensaje de error al controlador
            ctrlSocket.emit("LOGIN_CONTROL_PARENTAL", "ERROR");
        }
    });

    socket.on("CTRL_CP_LOGGED", () => {
        console.log("CTRL_CP_LOGGED");

        // Enviamos un mensaje al visor para que se redirija a la página de control parental
        visSocket.emit("CTRL_CP_LOGGED");
    });

    socket.on("CTRL_REGISTER", (username, password) => {

        // Creamos un nuevo objeto con los datos del nuevo usuario.        
        const contenidoJSON = fs.readFileSync("contenido.json");
        const contenido = JSON.parse(contenidoJSON);

        const nuevoUsuario = {
            usuario: username,
            password: password,
            contenido: contenido
        };

        // Si el archivo usuarios.json no existe, lo creamos con un array vacío
        if (!fs.existsSync("usuarios.json")) {
            fs.writeFileSync("usuarios.json", "[]");
        }

        // Leemos el archivo usuarios.json y parseamos su contenido
        const usuariosJSON = fs.readFileSync("usuarios.json");
        const usuarios = JSON.parse(usuariosJSON);

        // Verificamos si ya existe un usuario con el mismo nombre
        const usuarioExistente = usuarios.find(user => user.usuario === username);

        if (usuarioExistente) {
            // Si el usuario ya existe, enviamos un mensaje de error al controlador
            if (ctrlSocket) ctrlSocket.emit("CTRL_REGISTER_ERROR", "El usuario ya existe");
        } else {
            // Si el usuario no existe, lo agregamos al array de usuarios
            usuarios.push(nuevoUsuario);

            // Escribimos los cambios en el archivo usuarios.json
            fs.writeFileSync("usuarios.json", JSON.stringify(usuarios, null, 4));

            // Enviamos un mensaje de éxito al controlador
            if (ctrlSocket) ctrlSocket.emit("CTRL_REGISTER_SUCCESS", "El usuario ha sido registrado exitosamente");
        }
    });

    socket.on("CTRL_LOGIN", (username, password) => {
        // Leemos el archivo usuarios.json y parseamos su contenido
        const usuariosJSON = fs.readFileSync("usuarios.json");
        const usuarios = JSON.parse(usuariosJSON);

        // Buscamos al usuario en el array de usuarios
        const usuario = usuarios.find(user => user.usuario === username);

        if (usuario) {
            // Si el usuario existe, verificamos si la contraseña es correcta
            if (usuario.password === password) {
                // Si la contraseña es correcta, enviamos un mensaje de éxito al controlador
                if (ctrlSocket) {
                    usuarioActual = username;
                    ctrlSocket.emit("CTRL_LOGIN_SUCCESS", "El usuario ha iniciado sesión exitosamente");
                }
            } else {
                // Si la contraseña es incorrecta, enviamos un mensaje de error al controlador
                if (ctrlSocket) ctrlSocket.emit("CTRL_LOGIN_ERROR", "La contraseña es incorrecta");
            }
        } else {
            // Si el usuario no existe, enviamos un mensaje de error al controlador
            socket.emit("CTRL_LOGIN_ERROR", "El usuario no existe");
        }
    });

    socket.on("CTRL_LOGOUT", () => {
        if (visSocket) visSocket.emit("CTRL_LOGOUT");
    });


    socket.on("CTRL_DISCONNECTED", () => {
        console.log("CTRL_DISCONNECTED");
        isCtrlConnected = false;

        if (visSocket) visSocket.emit("CTRL_DISCONNECTED");
    });


    socket.on("LOAD_FAVORITES", () => {
        console.log("LOAD_FAVORITES");

        visSocket = socket;

        // Leemos el archivo usuarios.json y parseamos su contenido
        const usuariosJSON = fs.readFileSync("usuarios.json");
        const usuarios = JSON.parse(usuariosJSON);

        let html = "";
        let counter = 0;
        usuarios.forEach(user => {
            if (user.usuario === usuarioActual) {
                user.contenido.forEach(sel => {
                    if (sel.favoritos === "yes") {
                        counter += 1;
                        html += `<div class="caja ${counter}" data-video="${sel.path_video}" data-id="${counter}">
                                <img src="${sel.path_imagen}" alt="${sel.nombre}">
                            </div>`
                    }
                });
            }
        });

        // Enviamos el HTML al visualizador
        if (visSocket) visSocket.emit("UPDATE_CONTENT", html);
    });


    socket.on("LOAD_CONTENT", () => {
        console.log("LOAD_CONTENT");

        visSocket = socket;
        visSocket = socket;

        // Leemos el archivo series.json y parseamos su contenido
        const seriesJSON = fs.readFileSync("usuarios.json");
        const usuarios = JSON.parse(seriesJSON);

        let html = "";
        let restringido;
        let counter = 0;
        usuarios.forEach(usuario => {
            if (usuario.usuario === usuarioActual) {
                usuario.contenido.forEach(sel => {
                    if (sel.restricted === "no") {
                        restringido = "fas fa-check"
                    } else {
                        restringido = "fas fa-times"
                    }
                    counter += 1;
                    html += `<div class="caja ${counter}" data-video=${sel.path_video}" data-id="${counter}">
                                <div class="icon"><i class="${restringido}"></i></div>
                                <img src="${sel.path_imagen}" alt="${sel.nombre}">
                            </div>`;
                });
            }
        });

        // Enviamos el HTML al visualizador
        if (visSocket) visSocket.emit("UPDATE_CONTENT", html);
    });


    socket.on("RESTRICT_CONTENT", (nombre) => {
        console.log("RESTRICT_CONTENT");

        // Leemos el archivo series.json y parseamos su contenido
        const seriesJSON = fs.readFileSync("usuarios.json");
        const usuarios = JSON.parse(seriesJSON);

        usuarios.forEach(user => {
            if (user.usuario === usuarioActual) {
                user.contenido.forEach(sel => {
                    if (sel.nombre === nombre) {
                        if (sel.restricted === "no") {
                            sel.restricted = "yes";
                        } else {
                            sel.restricted = "no";
                        }
                    }
                });
            }
        });

        // Escribimos los cambios en el archivo
        fs.writeFileSync("usuarios.json", JSON.stringify(usuarios, null, 4));
    });


    socket.on("LOAD_BUSCADOR", () => {
        console.log("LOAD_BUSCADOR");

        visSocket = socket;

        // Leemos el archivo usuarios.json y parseamos su contenido
        const seriesJSON = fs.readFileSync("usuarios.json");
        const usuarios = JSON.parse(seriesJSON);

        let html = "";
        let counter = 0;
        usuarios.forEach(user => {
            if (user.usuario === usuarioActual) {
                user.contenido.forEach(sel => {
                    if (sel.restricted === "no") {
                        counter += 1;
                        html += `<div class="caja ${counter}" data-video="${sel.path_video}" data-id="${counter}">
                                    <img src="${sel.path_imagen}" alt="${sel.nombre}">
                                </div>`;
                    }
                });
            }
        });

        // Enviamos el HTML al visualizador
        if (visSocket) visSocket.emit("UPDATE_CONTENT", html);

        if (ctrlSocket) ctrlSocket.emit("BUSCAR_CARGADO");
    });


    socket.on("LOAD_SERIES", () => {
        console.log("LOAD_SERIES");

        visSocket = socket;

        // Leemos el archivo usuarios.json y parseamos su contenido
        const seriesJSON = fs.readFileSync("usuarios.json");
        const usuarios = JSON.parse(seriesJSON);

        let html = "";
        let counter = 0;
        usuarios.forEach(user => {
            if (user.usuario === usuarioActual) {
                user.contenido.forEach(sel => {
                    if (sel.restricted === "no") {
                        if (sel.tipo === "serie") {
                            counter += 1;
                            html += `<div class="caja ${counter}" data-video="${sel.path_video}" data-id="${counter}">
                                        <img src="${sel.path_imagen}" alt="${sel.nombre}">
                                    </div>`;

                        }
                    }
                });
            }
        });

        // Enviamos el HTML al visualizador
        if (visSocket) visSocket.emit("UPDATE_CONTENT", html);
    });


    socket.on("LOAD_MOVIES", () => {
        console.log("LOAD_MOVIES");

        visSocket = socket;

        // Leemos el archivo usuarios.json y parseamos su contenido
        const seriesJSON = fs.readFileSync("usuarios.json");
        const usuarios = JSON.parse(seriesJSON);

        let html = "";
        let counter = 0;
        usuarios.forEach(user => {
            if (user.usuario === usuarioActual) {
                user.contenido.forEach(sel => {
                    if (sel.restricted === "no") {
                        if (sel.tipo === "pelicula") {
                            counter += 1;
                            html += `<div class="caja ${counter}"  data-video="${sel.path_video}" data-id="${counter}">
                                        <img src="${sel.path_imagen}" alt="${sel.nombre}">
                                    </div>`;

                        }
                    }
                });
            }
        });

        // Enviamos el HTML al visualizador
        if (visSocket) visSocket.emit("UPDATE_CONTENT", html);
    });


    socket.on("LOAD_USUARIO", () => {
        console.log("LOAD_USUARIO");

        visSocket = socket;

        // Leemos el archivo usuarios.json y parseamos su contenido
        const usuariosJSON = fs.readFileSync("usuarios.json");
        const usuarios = JSON.parse(usuariosJSON);

        let html = "";
        let counter = 0;
        usuarios.forEach(user => {
            if (user.usuario === usuarioActual) {
                user.contenido.forEach(sel => {
                    if (sel.favoritos === "no" && counter < 9) {
                        counter += 1;
                        html += `<div class="caja ${counter}" data-video="${sel.path_video}" data-id="${counter}">
                                <img src="${sel.path_imagen}" alt="${sel.nombre}">
                            </div>`
                    }
                });
            }
        });

        // Enviamos el HTML al visualizador
        if (visSocket) visSocket.emit("UPDATE_CONTENT", html);
    });


    socket.on("GET_USUARIO", () => {
        console.log("GET_USUARIO");

        if (visSocket) visSocket.emit("DAR_USUARIO", usuarioActual);
    });


    socket.on("CAMBIO_CONTROLADOR", (data) => {
        console.log("CAMBIO_CONTROLADOR");
        videoActual = data;
        //console.log("Marcada ruta como actual: " + videoActual);

        if (ctrlSocket) ctrlSocket.emit("CAMBIAR_PANTALLA");
    });


    socket.on("REPRODUCIR", (data) => {
        videoActual = data;
        //console.log("Marcada ruta como actual: " + videoActual);
    });


    socket.on("PEDIR_RUTA", () => {
        if (visSocket) visSocket.emit("DAR_RUTA", videoActual);
        //console.log("Envío ruta: " + videoActual);
    });


    socket.on("AGITADO", (data) => {
        if (visSocket) visSocket.emit("AGITADO", data);
    });


    socket.on("VOZ", (data) => {
        if (visSocket) visSocket.emit("VOZ", data);
    });


    socket.on("MOVER_REPRODUCCION", (data) => {
        if (visSocket) visSocket.emit("MOVER_REPRODUCCION", data);
        console.log("MOVER_REPRODUCCION");
    });


    socket.on("VOLVER", (data) => {
        console.log("VOLVER");
        
        if (visSocket) visSocket.emit("VOLVER", data);
    });


    socket.on("CAMBIAR_VOLUMEN", (data) => {
        console.log("CAMBIAR_VOLUMEN");

        if (visSocket) visSocket.emit("CAMBIAR_VOLUMEN", data);
    });


    socket.on("GESTO", (data) => {
        //console.log(data);

        if (visSocket) visSocket.emit("GESTO", data);
    });


    socket.on("TOQUE", () => {
        console.log("TOQUE");

        if (visSocket) visSocket.emit("TOQUE");
    });

    
    socket.on("BUSCAR", (data) => {
        console.log("BUSCAR");

        const seriesJSON = fs.readFileSync("usuarios.json");
        const usuarios = JSON.parse(seriesJSON);

        console.log(data);
        console.log(usuarioActual);

        let html = "";
        let counter = 0;
        usuarios.forEach(user => {
            if (user.usuario === usuarioActual) {
                user.contenido.forEach(sel => {
                    console.log(sel.nombre);
                    if (sel.restricted === "no" && sel.nombre.toLowerCase().includes(data.toLowerCase())) {
                        counter += 1;
                        html += `<div class="caja ${counter}" data-video="${sel.path_video}" data-id="${counter}">
                                    <img src="${sel.path_imagen}" alt="${sel.nombre}">
                                </div>`;
                    }
                });
            }
        });

        console.log(html);

        if (visSocket) visSocket.emit("UPDATE_CONTENT", html);
    });

    
    socket.on("REQUEST_RUTA", function() {
        console.log("REQUEST_RUTA");
        
        ctrlSocket = socket;
       
        if (visSocket) visSocket.emit("REQUEST_RUTA");
    });

    
    socket.on("RESULT_RUTA", function(ruta) {
        //console.log("RESULT_RUTA " + ruta);
        
        if (ctrlSocket) ctrlSocket.emit("RESULT_RUTA", ruta);
    });

    
    socket.on("ME_GUSTA", (rutaVideo) => {
        console.log("ME_GUSTA");

        // Leemos el archivo usuarios.json y parseamos su contenido
        const seriesJSON = fs.readFileSync("usuarios.json");
        const usuarios = JSON.parse(seriesJSON);

        resultado = "no";

        usuarios.forEach(user => {
            if (user.usuario === usuarioActual) {
                user.contenido.forEach(sel => {
                    if (sel.path_video === rutaVideo) {
                        if (sel.favoritos === "no") {
                            sel.favoritos = "yes";
                            resultado = "yes";
                        } else {
                            sel.favoritos = "no";
                        }
                    }
                });
            }
        });

        // Escribimos los cambios en el archivo
        fs.writeFileSync("usuarios.json", JSON.stringify(usuarios, null, 4));

        // Enviamos el resultado al visualizador
        if (ctrlSocket) ctrlSocket.emit("CHECK_ME_GUSTA", resultado);
        if (visSocket) visSocket.emit("CHECK_ME_GUSTA", resultado);
    });

    
    socket.on("CHECK_ME_GUSTA", (rutaVideo) => {
        console.log("CHECK_ME_GUSTA");

        // Leemos el archivo usuarios.json y parseamos su contenido
        const seriesJSON = fs.readFileSync("usuarios.json");
        const usuarios = JSON.parse(seriesJSON);

        resultado = "no";

        usuarios.forEach(user => {
            if (user.usuario === usuarioActual) {
                user.contenido.forEach(sel => {
                    if (sel.path_video === rutaVideo) {
                        if (sel.favoritos === "yes") {
                            resultado = "yes";
                        }
                    }
                });
            }
        });

        // Enviamos el resultado al visualizador
        if (ctrlSocket) ctrlSocket.emit("CHECK_ME_GUSTA", resultado);
    });

    
    socket.on("VIDEO_PLAYED", function() {
        console.log("VIDEO_PLAYED");
        
        if (ctrlSocket) ctrlSocket.emit("VIDEO_PLAYED");
    });

});


server.listen(3000, () => {
    console.log("Server listening...");
});
