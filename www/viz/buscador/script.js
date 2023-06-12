
// Acción dependiendo de la página actual.
visSocket.emit("VIS_LOGGED");
visSocket.emit("LOAD_BUSCADOR");


visSocket.on("UPDATE_CONTENT", function(html) {

    if (html != "") {
      document.querySelector(".contenedor").innerHTML = html;
      document.getElementsByClassName("1")[0].classList.add("seleccion");
    }
    else{
      document.querySelector(".contenedor").innerHTML = "<h1>No se han encontrado resultados</h1>";
    }
  
  });
  
  
  visSocket.on("TOQUE", function() {
    seleccionado = document.getElementsByClassName("seleccion");
    var video = seleccionado[0].getAttribute("data-video");
  
    if (video != null) {
      visSocket.emit("CAMBIO_CONTROLADOR", video);
      window.location.href = "../reproduccion";
    }
  
  });
  
  visSocket.on("GESTO", function(data) {
    seleccionado = document.getElementsByClassName("seleccion");
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
  
  visSocket.on("VOLVER", function(datos) {
    if (datos == 1) {
      window.location.href = "../";
    }
  });