var slider = document.getElementsByClassName("slider");
var caja1 = document.getElementsByClassName("caja1");
var caja2 = document.getElementsByClassName("caja2");
var caja3 = document.getElementsByClassName("caja3");

var salir = document.getElementsByClassName("salir");
var lupa = document.getElementsByClassName("lupa");
var control_parental = document.getElementsByClassName("control-parental");
var user = document.getElementsByClassName("user");

var seleccionado = document.getElementsByClassName("seleccion");
var id = seleccionado[0].getAttribute("data-id");


function eliminarSeleccion(seleccionados) {
  for (let i = 0; i < seleccionados.length; i++) {
    seleccionados[i].classList.remove("seleccion");
  }
}

visSocket.emit("VIS_LOGGED");

visSocket.on("GESTO", function(data) {
  console.log(data);

  seleccionado = document.getElementsByClassName("seleccion");
  id = seleccionado[0].getAttribute("data-id");

  if (id == 'slider') {
    //console.log("Slider");
    if (data == "derecha") {
      //console.log("Derecha");
      $('.slider').slick('slickNext');
    }
    else if (data == "izquierda") {
      //console.log("Izquierda");
      $('.slider').slick('slickPrev');
    }
    else if (data == "abajo") {
      eliminarSeleccion(seleccionado)
      caja2[0].classList.add("seleccion");
    }
  }
  else if (id == 'caja1') {
    if (data == "izquierda") {
      //console.log("Izquierda");
      eliminarSeleccion(seleccionado)
      caja3[0].classList.add("seleccion");
    }
    else if (data == "derecha") {
      //console.log("Derecha");
      eliminarSeleccion(seleccionado)
      caja2[0].classList.add("seleccion");
    }
    else if (data == "arriba") {
      eliminarSeleccion(seleccionado)
      slider[0].classList.add("seleccion");
    }
    else if (data == "abajo") {
      eliminarSeleccion(seleccionado)
      salir[0].classList.add("seleccion");
    }
  }
  else if (id == 'caja2') {
    if (data == "derecha") {
      //console.log("Derecha");
      eliminarSeleccion(seleccionado)
      caja3[0].classList.add("seleccion");
    }
    else if (data == "izquierda") {
      //console.log("Izquierda");
      eliminarSeleccion(seleccionado)
      caja1[0].classList.add("seleccion");
    }
    else if (data == "arriba") {
      eliminarSeleccion(seleccionado)
      slider[0].classList.add("seleccion");
    }
    else if (data == "abajo") {
      eliminarSeleccion(seleccionado)
      lupa[0].classList.add("seleccion");
    }
  }
  else if (id == 'caja3') {
    if (data == "derecha") {
      //console.log("Derecha");
      eliminarSeleccion(seleccionado)
      caja1[0].classList.add("seleccion");
    }
    else if (data == "izquierda") {
      //console.log("Izquierda");
      eliminarSeleccion(seleccionado)
      caja2[0].classList.add("seleccion");
    }
    else if (data == "arriba") {
      eliminarSeleccion(seleccionado)
      slider[0].classList.add("seleccion");
    }
    else if (data == "abajo") {
      eliminarSeleccion(seleccionado)
      user[0].classList.add("seleccion");
    }
  }
  else if (id == 'salir') {
    if (data == "arriba") {
      eliminarSeleccion(seleccionado)
      caja1[0].classList.add("seleccion");
    }
    else if (data == "derecha") {
      eliminarSeleccion(seleccionado)
      lupa[0].classList.add("seleccion");
    }
    else if (data == "izquierda") {
      eliminarSeleccion(seleccionado)
      user[0].classList.add("seleccion");
    }
  }
  else if (id == 'lupa') {
    if (data == "arriba") {
      eliminarSeleccion(seleccionado)
      caja2[0].classList.add("seleccion");
    }
    else if (data == "derecha") {
      eliminarSeleccion(seleccionado)
      control_parental[0].classList.add("seleccion");
    }
    else if (data == "izquierda") {
      eliminarSeleccion(seleccionado)
      salir[0].classList.add("seleccion");
    }
  }
  else if (id == 'control-parental') {
    if (data == "arriba") {
      eliminarSeleccion(seleccionado)
      caja2[0].classList.add("seleccion");
    }
    else if (data == "derecha") {
      eliminarSeleccion(seleccionado)
      user[0].classList.add("seleccion");
    }
    else if (data == "izquierda") {
      eliminarSeleccion(seleccionado)
      lupa[0].classList.add("seleccion");
    }
  }
  else if (id == 'user') {
    if (data == "arriba") {
      eliminarSeleccion(seleccionado)
      caja3[0].classList.add("seleccion");
    }
    else if (data == "derecha") {
      eliminarSeleccion(seleccionado)
      salir[0].classList.add("seleccion");
    }
    else if (data == "izquierda") {
      eliminarSeleccion(seleccionado)
      control_parental[0].classList.add("seleccion");
    }
  }
});

visSocket.on("TOQUE", function() {
  console.log("TOQUE");
  var src = seleccionado[0].getAttribute("data-html");
  id = seleccionado[0].getAttribute("data-id");

  //si el seleccionado es el slider coger el html del slide activo
  if (id == "slider") {
    seleccionado = document.getElementsByClassName("slick-active");
    src = seleccionado[0].querySelector("a").href.replace("http://localhost:3000/viz/", "");
    src = '../' + src;
    visSocket.emit("CAMBIO_CONTROLADOR", src);
    window.location.href = "./reproduccion";
  } else {
    if (src == "./") {
      visSocket.emit("SALIR_CTRL");
    }
    window.location.href = src;
  }
});


$(document).ready(function() {
  $('.slider').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    adaptiveHeight: true
  });
});
