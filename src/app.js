const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const socket = require("socket.io");

//Vinculo las rutas
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

//Indico al servidor que voy a trabajar con JSON y datos complejos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./src/public"));

//Configuro Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
  console.log(`Servidor express en el puerto http://localhost:${PUERTO}`);
});

//Configuro instancia de Socket.io del lado del servidor (desafío 4)
const io = socket(httpServer);

const ProductManager = require("./controllers/productManager.js");
const prodTest = new ProductManager("./src/models/array-product.json");

io.on("connection", async (socket) => {
  console.log("Escuchando la petición del cliente");

  //Envio el array de productos al cliente
  socket.emit("productos", await prodTest.readJson());

  //Recibo el evento "eliminarProducto" desde el cliente
  socket.on("eliminarProducto", async (id) => {
    await prodTest.deleteProduct(id);

    //Envío el array actualizado
    socket.emit("productos", await prodTest.getProducts());
  });

  //Recibo el evento "agregarProducto" desde el cliente
  socket.on("agregarProducto", async (producto) => {
    await prodTest.addProduct(producto);
    socket.emit("productos", await prodTest.getProducts());
  });
});
