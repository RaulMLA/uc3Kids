let X = 0;
let Y = 0;
let Z = 0;

let rutaVideo = "undefined";


if ('Accelerometer' in window) {
	try {
		const acc = new Accelerometer({ frequency: 60 });

		acc.addEventListener("reading", function () {

			const dispX = Math.abs(X - acc.x);
			const dispY = Math.abs(Y - acc.y);
			const dispZ = Math.abs(Z - acc.z);

			ctrlSocket.emit("AGITADO", { x: dispX, y: dispY, z: dispZ });
			X = acc.x;
			Y = acc.y;
			Z = acc.z;
			console.log("X: " + X + " Y: " + Y + " Z: " + Z);
		});
		acc.start();
	} catch (err) {
		console.log(err);
	}
}

if ('webkitSpeechRecognition' in window) {
	var reconocimiento = new webkitSpeechRecognition();
	var palabras = new webkitSpeechGrammarList();

	const gramatica = '#JSGF V1.0; grammar palabras; public <palabra> = parar|pausa|pausar|para|párate|reproducir|continuar|seguir|sigue|atrasar|atrás|adelantar|adelante|subir volumen|subir|sube|más volumen|bajar volumen|bajar|baja|menos volumen ;';
	palabras.addFromString(gramatica, 1);

	reconocimiento.grammars = palabras;
	reconocimiento.continuous = true;
	reconocimiento.interimResults = false;
	reconocimiento.lang = "es-ES";
	reconocimiento.maxAlternatives = 1;

	reconocimiento.start();

	reconocimiento.onend = function () {
		reconocimiento.start();
	}

	reconocimiento.onresult = function (event) {
		var resultado = event.results[0][0].transcript;
		ctrlSocket.emit("VOZ", resultado);
	}

	reconocimiento.onerror = function (event) {
		console.log(`Ha habido un problema con el reconocimiento de voz: ${event.error}`);
	};
}

ctrlSocket.emit("REQUEST_RUTA");

ctrlSocket.on("RESULT_RUTA", function (ruta) {
	rutaVideo = ruta;
	ctrlSocket.emit("CHECK_ME_GUSTA", rutaVideo);
});

ctrlSocket.on("CHECK_ME_GUSTA", function (datos) {
	if (datos === "yes") {
		document.getElementById("like").src = "../../viz/src/like_pressed.png";
	} else if (datos === "no") {
		document.getElementById("like").src = "../../viz/src/like.png";
	}
});

ctrlSocket.on("VIDEO_PLAYED", function () {
	ctrlSocket.emit("REQUEST_RUTA");
});


function volver() {
	ctrlSocket.emit("VOLVER", 1);
	window.location.href = "../";
}


function adelantar() {
	ctrlSocket.emit("MOVER_REPRODUCCION", 1);
}


function atrasar() {
	ctrlSocket.emit("MOVER_REPRODUCCION", -1);
}


function subirVol() {
	ctrlSocket.emit("CAMBIAR_VOLUMEN", "subir");
}


function bajarVol() {
	ctrlSocket.emit("CAMBIAR_VOLUMEN", "bajar");
}


function like() {
	ctrlSocket.emit("ME_GUSTA", rutaVideo);
}
