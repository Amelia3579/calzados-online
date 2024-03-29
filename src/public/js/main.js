// Actividad desafío4 (Websockets)
//Genero instancia de Socket.io del lado del cliente
const socket = io();

//Uso la instancia creada para establecer la conexión
socket.on("productos", (data) => {
  renderProductos(data);
});

//Función para renderizar los productos disponibles
const renderProductos = (productos) => {
  const containerProducts = document.getElementById("containerProducts");
  containerProducts.innerHTML = "";

  const titulo = document.createElement("h1");
  titulo.classList.add("tituloPrinc")
  titulo.textContent = "Lista de Productos";
  containerProducts.appendChild(titulo);

  productos.forEach((element) => {
    const card = document.createElement("div");
    card.classList.add("cardContainer");
    card.innerHTML = `    
                          <div class = "card">
                          <p> ID: ${element.id}</p>
                          <p> Título: ${element.title} </p>     
                          <p> Precio: ${element.price} </p>     
                          <button class = "cardButton"> Eliminar producto </button>
                          </div>
        `;
    containerProducts.appendChild(card);

    //Evento al botón de eliminar producto
    card.querySelector("button").addEventListener("click", () => {
      eliminarProducto(element.id);
    });
  });
};

//Elimino producto
const eliminarProducto = (id) => {
  socket.emit("eliminarProducto", id);
};

//Agrego producto
document.getElementById("btnEnviar").addEventListener("click", () => {
  agregarProducto();
});

const agregarProducto = () => {
  const producto = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    img: document.getElementById("img").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    status: document.getElementById("status").value === "true",
  };
  socket.emit("agregarProducto", producto);

  const form = document.querySelector("form");
  form.reset();
};
