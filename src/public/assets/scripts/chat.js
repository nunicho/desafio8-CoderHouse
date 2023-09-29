const socket = io();

let nombre = "";
let divMensajes = document.getElementById("mensajes");
let inputMensajes = document.getElementById("mensaje");

inputMensajes.addEventListener("keyup", (evt) => {
  // console.log(evt)
  if (evt.key === "Enter") {
    if (evt.target.value.trim() !== "") {
      socket.emit("nuevoMensaje", {
        emisor: nombre,
        mensaje: evt.target.value.trim(),
      });
      evt.target.value = "";
      inputMensajes.focus();
    }
  }
});

Swal.fire({
  title: "Ingrese su correo electrónico",
  input: "email",
  inputAttributes: {
    autocapitalize: "off",
  },
  inputValidator: (value) => {
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
      return "Debe ingresar un correo electrónico válido...!!!";
    }
  },
  allowOutsideClick: false,
}).then((resultado) => {
  nombre = resultado.value;

  document.title = nombre;
  inputMensajes.focus();

  socket.emit("id", nombre);

  socket.on("bienvenida", (mensajes) => {
    let txt = "";

    mensajes.forEach((mensaje) => {
      txt += `<p class='mensaje'><strong>${mensaje.emisor}</strong>:<i>${mensaje.mensaje}</i></p><br>`;
    });
    divMensajes.innerHTML = txt;
    divMensajes.scrollTop = divMensajes.scrollHeight;
  });

  socket.on("nuevoUsuario", (nombre) => {
    Swal.fire({
      text: `${nombre} se ha conectado...!!!`,
      toast: true,
      position: "top-right",
    });
  });
  socket.on("llegoMensaje", (mensaje) => {
    let txt = "";
    txt += `<p class='mensaje'><strong>${mensaje.emisor}</strong>:<i>${mensaje.mensaje}</i></p><br>`;

    divMensajes.innerHTML += txt;
    divMensajes.scrollTop = divMensajes.scrollHeight;
  });
  socket.on("usuarioDesconectado", (usuario) => {
    Swal.fire({
      text: `${usuario.nombre} ha abandonado el chat`,
      toast: true,
      position: "top-right",
    });
  });
});
