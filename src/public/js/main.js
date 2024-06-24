// Actividad desafío4 (Websockets)
const socket = io();

// //Uso la instancia creada para establecer la conexión
// socket.on("products", (data) => {
//   renderProductos(data);
// });

// //Función para renderizar los productos disponibles
// const renderProductos = (products) => {
//   const containerProducts = document.getElementById("containerProducts");
//   containerProducts.innerHTML = "";

//   const titulo = document.createElement("h1");
//   titulo.classList.add("tituloPrinc");
//   titulo.textContent = "List of Products";
//   containerProducts.appendChild(titulo);

//   products.forEach((element) => {
//     const card = document.createElement("div");
//     card.classList.add("cardContainer");
//     card.innerHTML = `
//                           <div class = "card">
//                           <p> ID: ${element._id}</p>
//                           <p> Title : ${element.title} </p>
//                           <p> Price: $${element.price} </p>
//                           <button class = "cardButton"> Remove Product </button>
//                           </div>
//         `;
//     containerProducts.appendChild(card);

//     //Evento al botón de eliminar producto
//     card.querySelector("button").addEventListener("click", () => {
//       deleteProduct(element._id);
//     });
//   });
// };

// //Elimino producto
// const deleteProduct = (_id) => {
//   socket.emit("deleteProduct", _id);
// };

// //Agrego producto
// document.getElementById("btnEnviar").addEventListener("click", () => {
//   addProduct();
// });

// const addProduct = () => {
//   const producto = {
//     title: document.getElementById("title").value,
//     description: document.getElementById("description").value,
//     price: document.getElementById("price").value,
//     img: document.getElementById("img").value,
//     code: document.getElementById("code").value,
//     stock: document.getElementById("stock").value,
//     category: document.getElementById("category").value,
//     status: document.getElementById("status").value === "true",
//   };
//   socket.emit("addProduct", producto);

//   const form = document.querySelector("form");
//   form.reset();
// };

//Actividad desafío complementario (MongoDB)
//Configuración chat. Creo una variable para guardar el usuario
let user;
const chatBox = document.getElementById("chatBox");

//Utilizo Sweet Alert para el mensaje de bienvenida
Swal.fire({
  title: "Identificate",
  input: "text",
  text: "Ingresá un nombre para iniciar el chat",
  //Validación para que contenga el nombre
  inputValidator: (value) => {
    return !value && "Es necesario completar el nombre para continuar";
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
