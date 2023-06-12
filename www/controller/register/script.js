ctrlSocket.on("connect", function () {
    ctrlSocket.emit("CTRL_CONNECTED");
});

// Si se recibe CTRL_REGISTER_ERROR es porque el usuario ya existe.
ctrlSocket.on("CTRL_REGISTER_ERROR", function () {
    // Obtenemos el elemento del formulario de registro.
    const form = document.getElementById("register-form");

    // Verificamos si ya hay un mensaje de error mostrándose.
    const error = form.querySelector(".register-info");
    if (error) return;

    // Creamos un nuevo elemento para mostrar el mensaje de error.
    const errorMessage = document.createElement("p");
    errorMessage.innerText = "El usuario ya existe";
    errorMessage.style.color = "var(--rojo)";
    errorMessage.classList.add("register-info");
    errorMessage.style.textAlign = "center";

    // Insertamos el mensaje de error en el formulario, después del botón de registro
    const registerBtn = form.querySelector("#register-btn");
    form.insertBefore(errorMessage, registerBtn.nextSibling);

    // Volvemos a mostrar el formulario de registro después de 3 segundos.
    setTimeout(() => {
        errorMessage.remove();
    }, 2000);
});

// Si se recibe CTRL_REGISTER_SUCCESS es porque el usuario se ha registrado correctamente.
ctrlSocket.on("CTRL_REGISTER_SUCCESS", function () {
    // Obtenemos el elemento del formulario de registro.
    const form = document.getElementById("register-form");

    // Verificamos si ya hay un mensaje de error mostrándose.
    const error = form.querySelector(".register-info");
    if (error) return;

    // Creamos un nuevo elemento para mostrar el mensaje de error.
    const advertencia = document.createElement("p");
    advertencia.innerText = "Registro exitoso";
    advertencia.style.color = "var(--verde)";
    advertencia.classList.add("register-info");
    advertencia.style.textAlign = "center";

    // Insertamos el mensaje de error en el formulario, después del botón de registro
    const registerBtn = form.querySelector("#register-btn");
    form.insertBefore(advertencia, registerBtn.nextSibling);

    // Volvemos a mostrar el formulario de registro después de 3 segundos.
    setTimeout(() => {
        advertencia.remove();
        showLoginForm();
    }, 2000);
});

// Si se recibe CTRL_LOGIN_ERROR es porque el usuario no existe o la contraseña es incorrecta.
ctrlSocket.on("CTRL_LOGIN_ERROR", function () {
    // Obtenemos el elemento del formulario de registro.
    const form = document.getElementById("login-form");

    // Verificamos si ya hay un mensaje de error mostrándose.
    const error = form.querySelector(".login-info");
    if (error) return;

    // Creamos un nuevo elemento para mostrar el mensaje de error.
    const errorMessage = document.createElement("p");
    errorMessage.innerText = "Contraseña incorrecta";
    errorMessage.style.color = "var(--rojo)";
    errorMessage.classList.add("login-info");
    errorMessage.style.textAlign = "center";

    // Insertamos el mensaje de error en el formulario, después del botón de registro
    const loginBtn = form.querySelector("#login-btn");
    form.insertBefore(errorMessage, loginBtn.nextSibling);

    // Volvemos a mostrar el formulario de registro después de 3 segundos.
    setTimeout(() => {
        errorMessage.remove();
    }, 2000);
});

// Si se recibe CTRL_LOGIN_SUCCESS es porque el usuario ha iniciado sesión correctamente.
ctrlSocket.on("CTRL_LOGIN_SUCCESS", function () {
    ctrlSocket.emit("CTRL_LOGGED");
    window.location.href = "/controller";
});


// Función de registro.
function register() {

    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;

    if (username && password) {
        ctrlSocket.emit("CTRL_REGISTER", username, password);
    }
}


// Función de inicio de sesión.
function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
        ctrlSocket.emit("CTRL_LOGIN", username, password);
    }
}


function showRegisterForm() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
    document.title = "Registrarse - UC3Kids";
}


function showLoginForm() {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("register-form").style.display = "none";
    document.title = "Iniciar Sesión - UC3Kids";
}

const registerLink = document.querySelector('.toggle-form a');

registerLink.addEventListener('click', (event) => {
    event.preventDefault();
    showRegisterForm();
});

// Al pulsar el botón de registro, se ejecuta la función register().
document.getElementById("register-btn").addEventListener("click", function (event) {
    event.preventDefault();
    register();
});

// Al pulsar el botón de inicio de sesión, se ejecuta la función login().
document.getElementById("login-btn").addEventListener("click", function (event) {
    event.preventDefault();
    login();
});
