// Acción dependiendo de la página actual.
visSocket.emit("VIS_LOGGED");
visSocket.emit("LOAD_CONTENT");

visSocket.on("UPDATE_CONTENT", function (html) {
	document.querySelector(".contenedor").innerHTML = html;

	// Obtener todas las cajas
	var cajas = document.querySelectorAll('.caja');

    cajas[0].classList.add("seleccion");

	// Añadir un listener a cada caja
	cajas.forEach(function (caja) {
		caja.addEventListener('click', function () {
			visSocket.emit("RESTRICT_CONTENT", caja.querySelector('img').alt);
			if (caja.querySelector('i').classList.contains('fa-times')) {
				caja.querySelector('i').classList.remove('fa-times');
				caja.querySelector('i').classList.add('fa-check');
			}
			else {
				caja.querySelector('i').classList.remove('fa-check');
				caja.querySelector('i').classList.add('fa-times');
			}
		});
	});
});

visSocket.on("TOQUE", function () {
	seleccionado = document.getElementsByClassName("seleccion");

	visSocket.emit("RESTRICT_CONTENT", seleccionado[0].querySelector('img').alt);
	if (seleccionado[0].querySelector('i').classList.contains('fa-times')) {
		seleccionado[0].querySelector('i').classList.remove('fa-times');
		seleccionado[0].querySelector('i').classList.add('fa-check');
	}
	else {
		seleccionado[0].querySelector('i').classList.remove('fa-check');
		seleccionado[0].querySelector('i').classList.add('fa-times');
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
