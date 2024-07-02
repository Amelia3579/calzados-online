const express = require("express");
const router = express.Router();

const CartManager = require("../controllers/cartManagerDb.js");
const cartTest = new CartManager();

const ProductManager = require("../controllers/productManagerDb.js");
const productTest = new ProductManager();

const ChatManager = require("../controllers/chatManagerDb.js");
const chatTest = new ChatManager();

const SessionManager = require("../controllers/sessionManagerDb.js");
const sessionTest = new SessionManager();

const SocketManager = require("../controllersSockets/socketManager.js");

const passport = require("passport");
//Verificación del rol
const verifyRole = require("../config/verifyRole.config.js");

//Middleware de autenticación con JWT
const authenticateJWT = passport.authenticate("jwt", { session: false });
//Middleware de loggers
const addLogger = require("../utils/loggers.js");

//Estructuración por capas
router.get("/carts/:cid", cartTest.getCartById);
router.post("/carts/:cid", cartTest.addProductToCart);
router.get(
  "/products",
  verifyRole(["User"]),
  authenticateJWT,
  productTest.getProducts
);
router.get("/chat", verifyRole(["User"]), chatTest.getChat);
router.get(
  "/realtimeproducts",
  verifyRole(["Admin"]),
  productTest.getRealTimeProducts
);
//Ruta para que cuando cargue la app, Login sea lo 1° que se renderize
router.get("/", sessionTest.getLoguin);
router.get("/register", sessionTest.getRegister);
//Ruta para mostrar logs
router.get("/loggerTest", addLogger, (req, res) => {
  req.logger.fatal("Mensaje del nivel 0: Fatal");
  req.logger.error("Mensaje del nivel 1: Error");
  req.logger.warning("Mensaje del nivel 2: Warning");
  req.logger.info("Mensaje del nivel 3: Info");
  req.logger.http("Mensaje del nivel 4: Http");
  req.logger.debug("Mensaje del nivel 5: Debug");

  res.send("Logs generados");
});

module.exports = router;
