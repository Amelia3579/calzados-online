const express = require("express");
const router = express.Router();

const CartManager = require("../controllers/cart.controller.js");
const cartTest = new CartManager();

const ProductManager = require("../controllers/product.controller.js");
const productTest = new ProductManager();

const ChatManager = require("../controllers/chat.controller.js");
const chatTest = new ChatManager();

const SessionManager = require("../controllers/session.controller.js");
const sessionTest = new SessionManager();

const ViewsController = require("../controllers/view.controller.js");
const viewsTest = new ViewsController();

const passport = require("passport");
//Verificación del rol
const verifyRole = require("../config/verifyRole.config.js");

//Middleware de autenticación con JWT
const authenticateJWT = passport.authenticate("jwt", { session: false });
//Middleware de Loggers
const addLogger = require("../utils/loggers.js");

//Estructuración por capas
router.get("/carts/:cid", cartTest.getCartById);
router.post("/carts/:cid", cartTest.addProductToCart);
router.get(
  "/products",
  verifyRole(["User", "Premium"]),
  authenticateJWT,
  productTest.getProducts
);
router.get("/chat", verifyRole(["User"]), chatTest.getChat);
router.get(
  "/realtimeproducts",
  verifyRole(["Admin", "Premium"]),
  productTest.getRealTimeProducts
);
//Ruta para que Login sea lo 1° que se renderize
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

//------Rutas para Envío de Emails (3° Práctica Integradora)------
router.get("/shippingconfirmation", viewsTest.renderConfirmation);
router.get("/resetpassword", viewsTest.renderResetPassword);
router.get("/changepassword", viewsTest.renderChangePassword);
module.exports = router;
