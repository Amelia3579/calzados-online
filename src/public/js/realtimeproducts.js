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

  const title = document.createElement("h1");
  title.textContent = "Products Available for Sale";
  containerProducts.appendChild(title);

  products.forEach((element) => {
    console.log("Product image URL:", element.img); // Verifica la ruta de la imagen

    const card = document.createElement("div");
    card.innerHTML = `
                          <div class = "cardProduct">
                          <img src="${
                          element.img || "/img/default.png"
                          }" alt="${element.title}" class="cardImage"/>
                          <p> ID: ${element._id}</p>
                          <p> Title: ${element.title} </p>
                          <p> Price: ${element.price} </p>
                          <button class = "btnProduct"> Remove Product </button>
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

// Evento del botón agregar producto
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

  socket.emit("addProduct", product, (productId) => {
    // Después de enviar los datos, subimos la imagen
    uploadImage(productId);
  });

  const form = document.querySelector("form");
  form.reset();
};

// Función para subir la imagen a través de una solicitud HTTP
function uploadImage(productId) {
  const imgInput = document.getElementById("image");
  if (imgInput && imgInput.files && imgInput.files.length > 0) {
    const formData = new FormData();
    formData.append("image", imgInput.files[0]);
    formData.append("productId", productId);

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Imagen subida correctamente:', data.imageUrl);
      // Aquí podrías renderizar la imagen junto con el producto si lo deseas
    })
    .catch(error => {
      console.error('Error subiendo la imagen:', error);
    });
  }
}




// document.getElementById("btnProduct").addEventListener("click", () => {
//   addProduct();
// });

// //Agrego producto
// const addProduct = () => {
//   const owner = role === "Premium" ? email : "Admin";

//   const product = {
//     title: document.getElementById("title").value,
//     description: document.getElementById("description").value,
//     price: document.getElementById("price").value,
//     img: document.getElementById("img").value,
//     code: document.getElementById("code").value,
//     stock: document.getElementById("stock").value,
//     category: document.getElementById("category").value,
//     status: document.getElementById("status").value === "true",
//     owner: owner,
//   };
//   socket.emit("addProduct", product);

//   const form = document.querySelector("form");
//   form.reset();
// };
