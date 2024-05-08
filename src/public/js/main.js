// Actividad desafío4 (Websockets)
//Genero instancia de Socket.io del lado del cliente
const socket = io();

// //Uso la instancia creada para establecer la conexión
// socket.on("productos", (data) => {
//   renderProductos(data);
// });

// //Función para renderizar los productos disponibles
// const renderProductos = (productos) => {
//   const containerProducts = document.getElementById("containerProducts");
//   containerProducts.innerHTML = "";

//   const titulo = document.createElement("h1");
//   titulo.classList.add("tituloPrinc");
//   titulo.textContent = "Lista de Productos";
//   containerProducts.appendChild(titulo);

//   productos.forEach((element) => {
//     const card = document.createElement("div");
//     card.classList.add("cardContainer");
//     card.innerHTML = `
//                           <div class = "card">
//                           <p> ID: ${element.id}</p>
//                           <p> Título: ${element.title} </p>
//                           <p> Precio: ${element.price} </p>
//                           <button class = "cardButton"> Eliminar producto </button>
//                           </div>
//         `;
//     containerProducts.appendChild(card);

//     //Evento al botón de eliminar producto
//     card.querySelector("button").addEventListener("click", () => {
//       eliminarProducto(element.id);
//     });
//   });
// };

// //Elimino producto
// const eliminarProducto = (id) => {
//   socket.emit("eliminarProducto", id);
// };

// //Agrego producto
// document.getElementById("btnEnviar").addEventListener("click", () => {
//   agregarProducto();
// });

// const agregarProducto = () => {
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
//   socket.emit("agregarProducto", producto);

//   const form = document.querySelector("form");
//   form.reset();
// };

//Actividad desafío complementario (MongoDB)
// Configuración chat. Creo una variable para guardar el usuario
let user;
const chatBox = document.getElementById("chatBox");

//Utilizo Sweet Alert para el mensaje de bienvenida
// Swal.fire({
//   title: "Identificate",
//   input: "text",
//   text: "Ingresá un nombre para iniciar el chat",
//   //Validación para que contenga el nombre
//   inputValidator: (value) => {
//     return !value && "Es necesario completar el campo para continuar";
//   },
//   //Anulo los clicks por fuera
//   allowOutsideClick: false,
// }).then((result) => {
//   if (result.isConfirmed) {
//     let userInput = result.value;
//     // Convertir a mayúsculas
//     user = userInput.toUpperCase();
//   }
// });

//Validación para evitar que se envíen espacios vacíos
// chatBox.addEventListener("keyup", (event) => {
//   if (event.key === "Enter") {
//     if (chatBox.value.trim().length > 0) {
//       socket.emit("message", { user: user, message: chatBox.value });
//       chatBox.value = "";
//     }
//   }
// });

// //Listener de mensajes (recibo el array con todos los mensajes que me está enviando el servidor)
// socket.on("logMessages", (data) => {
//   const log = document.getElementById("logMessages");
//   let messages = "";

//   data.forEach((message) => {
//     messages = messages + `${message.user} dice: ${message.message} <br>`;
//   });
//   log.innerHTML = messages;
// });

//Actividad 2° pre-entrega
//Funcionalidad de botón agregar al carrito (se deja comentado ya que no se pide)
// document.addEventListener("DOMContentLoaded", () => {
//   document.querySelectorAll(".btnAgregar").forEach((button) => {
//     button.addEventListener("click", async (event) => {
//       const prodId = event.target.getAttribute("data-product-id");
//       const cartId = "662dd3c2226af293380b5f68";

//       const data = {
//         productId: prodId,
//         quantity: 1,
//       };

//       // Consolea los datos antes de enviar la solicitud
//       console.log("Datos del producto a enviar:", data);

//       try {
//         const response = await fetch(`/carts/${cartId}`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             productId: prodId,
//             quantity: 1,
            
//           }),
//         });

//         if (!response.ok) {
//           throw new Error("Error al agregar el producto al carrito");
//         }

//         alert("Producto agregado al carrito correctamente");

//         window.location.href = `/carts/${cartId}`;
//       } catch (error) {
//         console.error(error);
//         alert("Ocurrió un error al agregar el producto al carrito");
//       }
//     });
//   });
// });
