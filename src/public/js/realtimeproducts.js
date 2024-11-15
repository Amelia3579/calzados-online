//------Lógica para manejo de productos desde el lado del cliente (Websockets)------
const socket = io();

//Creo variables para rol y email
const role = document.getElementById("role")?.textContent.trim();
const email = document.getElementById("email")?.textContent.trim();

//Uso la instancia creada para establecer la conexión
socket.on("products", (data) => {
  renderProductos(data);
});

//Función para renderizar los productos disponibles

const renderProductos = (products) => {
  const containerProducts = document.getElementById("containerProducts");
  containerProducts.innerHTML = "";

  products.forEach((element) => {
    const card = document.createElement("div");

    card.innerHTML = `
                          <div class = "card__product">
                          <img src="${element.img}" alt="${element.title}"/>
                          <p> ID: ${element._id}</p>
                          <p> Title: ${element.title} </p>
                          <p> Price: ${element.price} </p>
                          <button class = "btn__product"> Remove Product </button>
                          </div>
        `;
    containerProducts.appendChild(card);

    //Evento del botón eliminar producto
    card.querySelector("button").addEventListener("click", () => {
      if (role === "Premium" && element.owner === email) {
        deleteProduct(element._id);
      } else if (role === "Admin") {
        deleteProduct(element._id);
      } else {
        Swal.fire("Sorry! You can only delete products that belong to you..");
      }
    });
  });
};

//Elimino producto
const deleteProduct = (_id) => {
  socket.emit("deleteProduct", _id);
};

//Evento del botón agregar producto
document.getElementById("btnProduct").addEventListener("click", () => {
  addProduct();
});

const addProduct = () => {
  const owner = role === "Premium" ? email : "Admin";

  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    status: document.getElementById("status").value === "true",
    owner: owner,
  };

  socket.emit("addProduct", product, (pid) => {
    // Luego de que el producto es creado, subo la imagen
    const inputFile = document.getElementById("image");
    const formData = new FormData();

    if (inputFile.files.length > 0) {
      formData.append("image", inputFile.files[0]);

      fetch(`/${pid}/uploadimage`, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.error("Error uploading image:", data);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    } else {
      console.log("No image selected");
    }
  });
};

