const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");

//Vamos a vincular las rutas
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

//Le podemos decir al servidor que vamos a trabajar con JSON y datos complejos
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


app.listen(PUERTO, () => {
  console.log(`Servidor express en el puerto http://localhost:${PUERTO}`);
});
