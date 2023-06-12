let started = false;

let accelerometer;
let absOrientation;

let SensibilidadAcelerometro = 10;

let AbsoluteOrientationData_X_inicial;
let AbsoluteOrientationData_Y_inicial;
let AbsoluteOrientationData_Z_inicial;

let AcelerometroData_X;
let AcelerometroData_Y;
let AcelerometroData_Z;

let SensibilidadOrientation;

let AbsoluteOrientationData_X;
let AbsoluteOrientationData_Y;
let AbsoluteOrientationData_Z;

// GESTOS.
let SemaforoGestos;
let variacionDerecha = 0.4;
let variacionIzquierda = 0.3;
let variacionArriba = 0.3;
let variacionAbajo = 0.3;
let s_derecha = false;
let s_izquierda = false;
let invertir = false;
let usar_y = false;

ctrlSocket.emit("CTRL_LOGGED");

//LECTURA DE DATOS DEL ACELERÓMETRO
if ('Accelerometer' in window) {
	try {
		accelerometer = new Accelerometer({ frequency: 60 });
		accelerometer.onerror = (event) => {
			// Errores en tiempo de ejecución
			if (event.error.name === 'NotAllowedError') {
				alert('Permission to access sensor was denied.');
			} else if (event.error.name === 'NotReadableError') {
				alert('Cannot connect to the sensor.');
			}
		};
		accelerometer.onreading = (e) => {
			AcelerometroData_X = e.target.x;
			AcelerometroData_Y = e.target.y;
			AcelerometroData_Z = e.target.z;
			//gestos(AcelerometroData_X, AcelerometroData_Y, AcelerometroData_Z);
		};

	} catch (error) {
		// Error en la creación del objeto
		if (error.name === 'SecurityError') {
			alert('Sensor construction was blocked by the Permissions Policy.');
		} else if (error.name === 'ReferenceError') {
			alert('Sensor is not supported by the User Agent.');
		} else {
			throw error;
		}
	}
}

if ('AbsoluteOrientationSensor' in window) {
	try {
		absOrientation = new AbsoluteOrientationSensor({ frequency: 10 });

		absOrientation.onreading = (e) => {
			const quat = e.target.quaternion;
			const angles = toEulerRollPitchYaw(quat);
			AbsoluteOrientationData_X = angles.roll;
			AbsoluteOrientationData_Y = angles.pitch;
			AbsoluteOrientationData_Z = angles.yaw;
			gestos(AbsoluteOrientationData_X, AbsoluteOrientationData_Y, AbsoluteOrientationData_Z);
		};


	} catch (err) {
		console.log(err);
	}
}

if (accelerometer) accelerometer.start();
if (absOrientation) absOrientation.start();

ctrlSocket.on("CAMBIAR_PANTALLA", function () {
	console.log("CAMBIAR_PANTALLA");
	window.location.href = "./reproduccion";
});

ctrlSocket.on("CP_VIS_CONNECTED", function () {
	window.location.href = "./controlparental";
});

ctrlSocket.on('BUSCAR_CARGADO', function() {
	window.location.href = "./buscador";
});

document.body.addEventListener("click", Start);

/*----------------------------*/
//CÓDIGO AL TOCAR LA PANTALLA//
/*----------------------------*/
async function Start() {
	if (!started) {

		document.documentElement.requestFullscreen();

		const divElem = document.querySelector("#msg-container");

		//borrar msg-container y crear uno nuevo
		divElem.parentNode.removeChild(divElem);
		const newDiv = document.createElement("div");
		newDiv.setAttribute("id", "msg-container-2");


		const newDiv2 = document.createElement("div");
		newDiv2.setAttribute("id", "arrows-container");

		newDiv.appendChild(newDiv2);
		document.body.appendChild(newDiv);

		//imagen flecha izquierda
		const img3 = document.createElement("img");
		img3.setAttribute("id", "img-flecha-izquierda");
		img3.setAttribute("src", "../viz/src/flecha_i.png");
		newDiv2.appendChild(img3);

		//imagen flecha derecha
		const img2 = document.createElement("img");
		img2.setAttribute("id", "img-flecha-derecha");
		img2.setAttribute("src", "../viz/src/flecha_d.png");
		newDiv2.appendChild(img2);

		//crear msg
		const msg = document.createElement("p");
		msg.setAttribute("id", "msg-agita");
		msg.innerHTML = "<span>MUEVE<br></span>PARA NAVEGAR<br><br><span>TOCA<br></span>PARA SELECCIONAR";
		newDiv.appendChild(msg);

		//imagen tocar
		const img = document.createElement("img");
		img.setAttribute("id", "img-tocar");
		img.setAttribute("src", "../viz/src/tocar.png");
		newDiv.appendChild(img);

		//cambiamos el id del contenedor-logo por contenedor-logo-2
		const divElem2 = document.querySelector("#contenedor-logo");
		divElem2.setAttribute("id", "contenedor-logo-2");

		//buscamos las id salir y user y activamos display block
		const divElem3 = document.querySelector("#salir");
		divElem3.style.display = "block";
		const divElem4 = document.querySelector("#user");
		divElem4.style.display = "block";

		async function seleccionar() {
			if (started) {
				ctrlSocket.emit('TOQUE');
			}
		}

		const msg_container_2 = document.querySelector("#msg-container-2");
		msg_container_2.addEventListener("click", seleccionar);

		//Guarda los valores iniciales de orientación y acelerómetro
		AbsoluteOrientationData_X_inicial = AbsoluteOrientationData_X;
		AbsoluteOrientationData_Y_inicial = AbsoluteOrientationData_Y;
		AbsoluteOrientationData_Z_inicial = AbsoluteOrientationData_Z;

		console.log("AcelerometroData_X_inicial: " + AbsoluteOrientationData_X_inicial);
		console.log("AcelerometroData_Y_inicial: " + AbsoluteOrientationData_Y_inicial);
		console.log("AcelerometroData_Z_inicial: " + AbsoluteOrientationData_Z_inicial);

		//espera 1 segundo y cambia started a true
		await new Promise(r => setTimeout(r, 1000));
		started = true;
	}

}


function volver() {
	ctrlSocket.emit("VOLVER", 1);
}


function toEulerRollPitchYaw(q) {
	const sinr_cosp = 2 * (q[3] * q[0] - q[1] * q[2]);
	const cosr_cosp = 1 - 2 * (q[0] * q[0] + q[1] * q[1]);
	const roll = Math.atan2(sinr_cosp, cosr_cosp);

	const sinp = Math.sqrt(1 + 2 * (q[3] * q[1] - q[0] * q[2]));
	const cosp = Math.sqrt(1 - 2 * (q[3] * q[1] + q[0] * q[2]));
	const pitch = 2 * Math.atan2(sinp, cosp) - Math.PI / 2;

	const siny_cosp = 2 * (q[3] * q[2] + q[0] * q[1]);
	const cosy_cosp = 1 - 2 * (q[1] * q[1] + q[2] * q[2]);
	const yaw = Math.atan2(siny_cosp, cosy_cosp);

	return { roll, pitch, yaw };
}


function calculoGestos(z) {
	if (z > 2.9) {
		s_izquierda = true;
	}
	else if (z < -2.8) {
		s_derecha = true;
	}

	if (z > 1.6 || z < -1.6) {
		invertir = true;
	}

	if (z > 1.6 && z < 1.99 || z < -1.6 && z > -1.99) {
		variacionAbajo = 0.2;
		variacionArriba = 0.2;
	}

	else if (z > 1.4 && z < 1.6) {
		usar_y = true;
		variacionArriba = 0.1;
		variacionAbajo = 0.1;
	}
	else if (z > -1.6 && z < -1.4) {
		usar_y = true;
		invertir = true;
		variacionAbajo = 0.1;
		variacionArriba = 0.1;
	}
}


function gestos(x, y, z) {
	calculoGestos(AbsoluteOrientationData_Z_inicial);

	x_i = AbsoluteOrientationData_X_inicial
	y_i = AbsoluteOrientationData_Y_inicial
	z_i = AbsoluteOrientationData_Z_inicial

	if (usar_y) {
		x_i = AbsoluteOrientationData_Y_inicial;
		x = y;
	}

	if (x > x_i + variacionArriba) {
		if (SemaforoGestos) {
			if (!invertir) {
				console.log("Arriba");
				ctrlSocket.emit('GESTO', 'arriba');
				SemaforoGestos = false;
			}
			else {
				console.log("Abajo");
				ctrlSocket.emit('GESTO', 'abajo');
				SemaforoGestos = false;
			}
		}
	}
	else if (x < x_i - variacionAbajo) {
		if (SemaforoGestos) {
			if (!invertir) {
				console.log("Abajo");
				ctrlSocket.emit('GESTO', 'abajo');
				SemaforoGestos = false;
			}
			else {
				console.log("Arriba");
				ctrlSocket.emit('GESTO', 'arriba');
				SemaforoGestos = false;
			}
		}
	}
	else if (((z > z_i + variacionIzquierda) && (z < z_i + 1)) || (s_izquierda && z < -2.6)) {
		if (SemaforoGestos) {
			console.log("izquierda");
			ctrlSocket.emit('GESTO', 'izquierda');
			SemaforoGestos = false;
		}
	}
	else if (((z < z_i - variacionDerecha) && (z > z_i - 1)) || (s_derecha && z > 2.6)) {
		if (SemaforoGestos) {
			console.log("derecha");
			ctrlSocket.emit('GESTO', 'derecha');
			SemaforoGestos = false;

		}
	}
	else {
		SemaforoGestos = true;
	}
}


ctrlSocket.on("SALIR_CTRL", ()=>{
    window.close();    
});