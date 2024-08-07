//------Lógica para manejo del chat desde el lado del cliente (Websockets)------
const socket = io();

//Creo una variable para guardar el usuario
let user;
const chatBox = document.getElementById("chatBox");

//Utilizo Sweet Alert para el mensaje de bienvenida
Swal.fire({
  title: "Identify yourself",
  input: "text",
  text: "Enter a name to start the chat",
  //Validación para que contenga el nombre
  inputValidator: (value) => {
    return !value && "It is necessary to complete the name to continue";
  },
  //Anulo los clicks por fuera
  allowOutsideClick: false,
}).then((result) => {
  if (result.isConfirmed) {
    let userInput = result.value;
    // Convertir a mayúsculas
    user = userInput.toUpperCase();
  }
});

//Validación para evitar que se envíen espacios vacíos
chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    //trim permite quitar los espacios en blanco del principio y final de un string.
    //Si la cantidad de caracteres del mensaje es mayor a 0, lo envío al servidor.
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

//Listener de mensajes (recibo el array con todos los mensajes que me está enviando el servidor)
socket.on("logMessages", (data) => {
  const log = document.getElementById("logMessages");
  let messages = "";

  data.forEach((message) => {
    messages += `${message.user} dice: ${message.message} <br>`;
  });
  log.innerHTML = messages;
});
