const form = document.getElementById('acceder-form');
const input = document.getElementById('text');

input.addEventListener('keyup', function() {
	const formData = new FormData(form);
  	const busqueda = formData.get('text');
	console.log(busqueda);
  	ctrlSocket.emit('BUSCAR', busqueda);
});

// Al pulsar el botón de acceder, se ejecuta la función acceder().
document.getElementById("buscar-btn").addEventListener("click", function(event) {
	event.preventDefault();
    window.location.href = "../";
});
