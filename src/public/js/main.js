// Actividad desafío4 (Websockets)
//Generamos instancia de Socket.io del lado del cliente
const socket = io();

//Usamos la instancia creada para establecer la conexión
socket.on("productos", (data) => {
  renderProductos(data);
});

//Función para renderizar los productos disponibles
const renderProductos = (productos) => {
  const containerProducts = document.getElementById("containerProducts");
  containerProducts.innerHTML = "";

  productos.forEach((element) => {
    const card = document.createElement("div");
    card.innerHTML = `
                          <p> ID: ${element.id}</p>
                          <p> Título: ${element.titulo} </p>
                          <p> Precio: ${element.precio} </p>
                          <button> Eliminar producto </button>
        `;
  });

  containerProducts.appendChild(card);
};

//01:45'