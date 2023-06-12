const video = document.getElementById('video');

var agitado = false;
var actualizado = false;
var rutaVideo = "../src/videos/blank.mp4";

visSocket.emit("VIDEO_PLAYED");
visSocket.emit("VIS_LOGGED");
visSocket.emit("PEDIR_RUTA");

visSocket.on("DAR_RUTA", function(datos) {
  rutaVideo = datos;
  actualizar();
});

visSocket.on("AGITADO", function(datos) {
  if ((datos.x > 10 && datos.y > 10) || (datos.x > 10 && datos.z > 10) || (datos.y > 10 && datos.z > 10)) {
    if (!agitado) {
      if (video.paused) {
        animar("play");
        video.play();
      } else {
        animar("pausa");
        video.pause();
      }
    }
    agitado = true;
  }
  if (agitado == true) {
    setTimeout(() => {
      agitado = false;
    }, 1000);
  }
});

visSocket.on("VOZ", function(datos) {
  if (datos == "reproducir" || datos == "seguir" || datos == "continuar" || datos == "sigue") {
    animar("play");
    video.play();
  } else if (datos == "parar" || datos == "pausar" || datos == "pausa" || datos == "párate" || datos == "para") {
    animar("pausa");
    video.pause();
  } else if (datos == "subir volumen" || datos == "subir" || datos == "sube" || datos == "más volumen") {
    animar("subir-volumen");
    video.volume += 0.1;
  } else if (datos == "bajar volumen" || datos == "bajar" || datos == "baja" || datos == "menos volumen") {
    animar("bajar-volumen");
    video.volume -= 0.1;
  } else if (datos == "adelantar" || datos == "adelante") {
    animar("adelantar");
    video.currentTime += 5;
  } else if (datos == "atrasar" || datos == "atrás") {
    animar("atrasar");
    video.currentTime -= 5;
  }
});
visSocket.on("MOVER_REPRODUCCION", function(datos) {
  if (datos == 1) {
    animar("adelantar");
    video.currentTime += 5;
  } else if (datos == -1) {
    animar("atrasar");
    video.currentTime -= 5;
  }
});
visSocket.on("CAMBIAR_VOLUMEN", function(datos) {
  if (datos == "subir") {
    animar("subir-volumen");
    video.volume += 0.1;
  } else if (datos == "bajar") {
    animar("bajar-volumen");
    video.volume -= 0.1;
  }
});
visSocket.on("VOLVER", function(datos) {
  if (datos == 1) {
    actualizado = false;
    video.pause();
    window.location.href = "../";
  }
});

visSocket.on("REQUEST_RUTA", function() {
  visSocket.emit("RESULT_RUTA", rutaVideo)
});

visSocket.on("CHECK_ME_GUSTA", function(data) {
  if (data === "no") animar("no_me_gusta");
  else animar("me_gusta");
});


/* Función animar deja visible el div correspondiente durante 0.2 segundos */
function animar(id) {
  var element = document.getElementById(id);
  let tiempo_animacion;

  if (id === "subir-volumen" || id === "bajar-volumen") {
    tiempo_animacion = 200;
  } else if (id === "me_gusta" || id === "no_me_gusta") {
    tiempo_animacion = 1000;
  } else {
    tiempo_animacion = 500;
  }

  element.style.opacity = 0;
  element.style.visibility = 'visible';

  setTimeout(() => {
    var start = null;
    function fade(timestamp) {
      if (!start) start = timestamp;
      var progress = timestamp - start;
      element.style.opacity = progress / tiempo_animacion;
      if (progress < tiempo_animacion) {
        requestAnimationFrame(fade);
      } else {
        element.style.visibility = 'hidden';
      }
    }
    requestAnimationFrame(fade);
  }, 0);
}


function actualizar() {
  if (!actualizado) {
    video.pause()
    video.src = rutaVideo;
    actualizado = true;
    video.play();
  }

}
