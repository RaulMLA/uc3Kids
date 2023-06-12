ctrlSocket.on("LOGIN_CONTROL_PARENTAL", function (data) {
    if (data === "OK") {
        ctrlSocket.emit("CTRL_CP_LOGGED");
        window.location.href = "../";
    } else { // data === "ERROR"
        // Obtenemos el elemento del formulario de registro.
        const form = document.getElementById("acceder-form");

        // Verificamos si ya hay un mensaje de error mostrándose.
        const error = form.querySelector(".acceso-info");
        if (error) return;

        // Creamos un nuevo elemento para mostrar el mensaje de error.
        const errorMessage = document.createElement("p");
        errorMessage.innerText = "Contraseña incorrecta";
        errorMessage.style.color = "var(--rojo)";
        errorMessage.classList.add("acceso-info");
        errorMessage.style.textAlign = "center";

        // Insertamos el mensaje de error en el formulario, después del botón de registro
        const accederBtn = form.querySelector("#acceder-btn");
        form.insertBefore(errorMessage, accederBtn.nextSibling);

        // Volvemos a mostrar el formulario de registro después de 3 segundos.
        setTimeout(() => {
            errorMessage.remove();
        }, 2000);
    }
});

// Función de acceso al control parental.
function acceder() {

    const password = document.getElementById("password").value;

    if (password) ctrlSocket.emit("LOGIN_CONTROL_PARENTAL", password);
}

// Al pulsar el botón de acceder, se ejecuta la función acceder().
document.getElementById("acceder-btn").addEventListener("click", function (event) {
    event.preventDefault();
    acceder();
});
