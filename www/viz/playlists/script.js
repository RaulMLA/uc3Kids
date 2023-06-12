var pageTitle = document.title;

// Acción dependiendo de la página actual.
visSocket.emit("VIS_LOGGED");

if (pageTitle == "Favoritos - uc3Kids") {
	visSocket.emit("LOAD_FAVORITES");
}
else if (pageTitle == "Series - uc3Kids") {
	visSocket.emit("LOAD_SERIES");
}
else if (pageTitle == "Películas - uc3Kids") {
	visSocket.emit("LOAD_MOVIES");
}


visSocket.on("UPDATE_CONTENT", function (html) {
	document.querySelector(".contenedor").innerHTML = html;
	document.getElementsByClassName("1")[0].classList.add("seleccion");

});


visSocket.on("TOQUE", function () {
	seleccionado = document.getElementsByClassName("seleccion");
	var video = seleccionado[0].getAttribute("data-video");

	if (video != null) {
		visSocket.emit("CAMBIO_CONTROLADOR", video);
		window.location.href = "../reproduccion";
	}

});

visSocket.on("GESTO", function (data) {
	seleccionado = document.getElementsByClassName("seleccion");
	seleccionado[0].scrollIntoView({ behavior: "smooth", block: "center", inline: "center"});
	id = seleccionado[0].getAttribute("data-id");
	let target;

	if (data == "derecha") {
		target = document.getElementsByClassName((parseInt(id) + 1))[0]
		if (target != undefined) {
			seleccionado[0].classList.remove("seleccion");
			target.classList.add("seleccion");
		}
	}
	else if (data == "izquierda") {
		target = document.getElementsByClassName((parseInt(id) - 1))[0]
		if (target != undefined) {
			seleccionado[0].classList.remove("seleccion");
			target.classList.add("seleccion");
		}
	}
	else if (data == "arriba") {
		target = document.getElementsByClassName((parseInt(id) - 3))[0]
		if (target != undefined) {
			seleccionado[0].classList.remove("seleccion");
			target.classList.add("seleccion");
		}
	}
	else if (data == "abajo") {
		target = document.getElementsByClassName((parseInt(id) + 3))[0]
		if (target != undefined) {
			seleccionado[0].classList.remove("seleccion");
			target.classList.add("seleccion");
		}
	}
});

visSocket.on("VOLVER", function (datos) {
	if (datos == 1) {
		window.location.href = "../";
	}
});
