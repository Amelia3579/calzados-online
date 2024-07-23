//Import Express
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");

//Importo Mongoose
const mongoose = require("mongoose");
const { configObject } = require("./config/config.js");
const { mongo_url, puerto } = configObject;

//Importo Passport
const passport = require("passport");
const jwt = require("passport-jwt");
// const jwtSocket = require("jsonwebtoken");
const { initializePassport } = require("./config/passport.config.js");
const cors = require("cors");

//Importo Socket
const SocketManager = require("./controllersSockets/socketManager.js");

//Importo Logger
const addLogger = require("./utils/loggers.js");
const path = require("path");


//Importo las rutas
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const usersRouter = require("./routes/users.router.js");
const sessionsRouter = require("./routes/sessions.router.js");

//Importo Middleware handleError
const handleError = require("./middleware/handleError.js");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(cookieParser());
//Middleware Logger
app.use(addLogger);

//Middleware Passport
app.use(passport.initialize());
initializePassport();

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

//Middleware para manejo de errores
app.use(handleError);

//Escucho el puerto usando Commander
const httpServer = app.listen(puerto, () => {
  console.log(`Servidor express en el puerto http://localhost:${puerto}`);
});

//Configuro instancia de Socket.io del lado del servidor (desafío 4)
new SocketManager(httpServer);

//Me conecto a MongoDB usando Commander
mongoose
  .connect(mongo_url)
  .then(() => console.log("Conección a MongoDB"))
  .catch((error) => console.log("Error de conección", error));
