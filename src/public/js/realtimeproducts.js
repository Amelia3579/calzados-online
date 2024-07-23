//------Lógica para manejo de productos desde el lado del cliente (Websockets)------
const socket = io();

//Creo variables para rol y email
const role = document.getElementById("role")?.textContent.trim();
const email = document.getElementById("email")?.textContent.trim();

console.log("User role:", role);
console.log("User email:", email);
//Uso la instancia creada para establecer la conexión
socket.on("products", (data) => {
  renderProductos(data);
});

//Función para renderizar los productos disponibles
const renderProductos = (products) => {
  const containerProducts = document.getElementById("containerProducts");
  containerProducts.innerHTML = "";

  const title = document.createElement("h1");
  title.classList.add("mainTitle");
  title.textContent = "List of Products";
  containerProducts.appendChild(title);

  products.forEach((element) => {
    const card = document.createElement("div");
    card.classList.add("cardContainer");
    card.innerHTML = `
                          <div class = "card">
                          <p> ID: ${element._id}</p>
                          <p> Title : ${element.title} </p>
                          <p> Price: $${element.price} </p>
                          <button class = "cardButton"> Remove Product </button>
                          </div>
        `;
    containerProducts.appendChild(card);

    //Evento del botón eliminar producto
    card.querySelector("button").addEventListener("click", () => {
      console.log("Prueba1", role, email);
      if ((role === "Admin" ) || (role === "Premium" && element.owner === email)){
        console.log("Prueba2", role, email);
        deleteProduct(element._id);
      }
    });
  });
}

  //Elimino producto
  const deleteProduct = (_id) => {
    console.log("Prueba3", _id);
    socket.emit("deleteProduct", _id);
  };

  //Evento del botón agregar producto
  document.getElementById("btnEnviar").addEventListener("click", () => {
    addProduct();
  });

  //Agrego producto
  const addProduct = () => {
    const owner = role === "Premium" ? email : "Admin";

    const product = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      price: document.getElementById("price").value,
      img: document.getElementById("img").value,
      code: document.getElementById("code").value,
      stock: document.getElementById("stock").value,
      category: document.getElementById("category").value,
      status: document.getElementById("status").value === "true",
      owner: owner,
    };
    socket.emit("addProduct", product);

    const form = document.querySelector("form");
    form.reset();
  };

