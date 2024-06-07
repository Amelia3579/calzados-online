const express = require("express");
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const passport = require("passport");
const configObject = require("./config/config.js");

const { mongo_url, puerto } = configObject;

const jwt = require("passport-jwt");
const { initializePassport } = require("./config/passport.config.js");
const PUERTO = 8080;
const database = require("./database.js");

//Vinculo las rutas
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const usersRouter = require("./routes/users.router.js");
const sessionsRouter = require("./routes/sessions.router.js");



//Middleware
//Indico al servidor que voy a trabajar con JSON y datos complejos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(
  session({
    secret: "secretPass",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://meligallegos:Paranaer1979@cluster0.kvvktyg.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0",
        ttl: 100,
    }),
  })
);

//Middleware Passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

//Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ success: false, message: "Error ocurred", error: err.message });
});

//Configuro Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Configuro Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);

const httpServer = app.listen(puerto, () => {
  console.log(`Servidor express en el puerto http://localhost:${puerto}`);
});

//Me conecto MongoDB usando .env
mongoose
  .connect(mongo_url)
  .then(() => console.log("Conección a MongoDB"))
  .catch((error) => console.log("Error de conección", error));



//Configuro instancia de Socket.io del lado del servidor (desafío 4)
const io = socket(httpServer);

const ProductManager = require("./controllers/productManagerDb.js");
const productTest = new ProductManager();
const ProductModel = require("./models/product.model.js");

//Configuración para realtimeproducts.handlebars
io.on("connection", async (socket) => {

  //Envio el array de productos al cliente
  socket.emit("productos", await productTest.getProductsSocket());

  //Recibo el evento "eliminarProducto" desde el cliente
  socket.on("eliminarProducto", async (id) => {
    await productTest.deleteProductSocket(id);

    //Envío el array actualizado
    socket.emit("productos", await productTest.getProductsSocket());
  });

  //Recibo el evento "agregarProducto" desde el cliente
  socket.on("agregarProducto", async (producto) => {
    await productTest.addProductSocket(producto);
    socket.emit("productos", await productTest.getProductsSocket());
  });
});

//Actividad desafío complementario
//Configuración para chat.handlebars
const MessageModel = require("./models/message.model.js");

io.on("connection", (socket) => {
  //Empiezo a escuchar los mensajes
  socket.on("message", async (data) => {
    //Guardo-creo documento con mensajes en MongoDB
    await MessageModel.create(data);

    //Recibo los mensajes de MongoDB
    const allMessages = await MessageModel.find();

    //Envío mensajes al cliente
    io.emit("logMessages", allMessages);
  });
});
