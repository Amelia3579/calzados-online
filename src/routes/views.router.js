const express = require("express");
const router = express.Router();

const CartController = require("../controllers/cart.controller.js");
const cartTest = new CartController();

const ProductController = require("../controllers/product.controller.js");
const productTest = new ProductController();

const ViewsController = require("../controllers/view.controller.js");
const viewsTest = new ViewsController();

const passport = require("passport");
//Verificación del rol
const verifyRole = require("../config/verifyRole.config.js");

//Middleware de autenticación con JWT
const authenticateJWT = passport.authenticate("jwt", { session: false });
//Middleware de Loggers
const addLogger = require("../utils/loggers.js");
const upload = require("../middleware/multer.js");

router.get("/carts/:cid", viewsTest.renderCart);
router.get(
  "/products",
  verifyRole(["User", "Premium"]),
  authenticateJWT,
  productTest.getProducts
);

router.get("/chat", verifyRole(["User", "Premium"]), viewsTest.renderChat);

router.get(
  "/realtimeproducts",
  verifyRole(["Admin", "Premium"]),
  viewsTest.renderRealTimeProducts
);

router.get("/", viewsTest.renderHome);
router.get("/login", viewsTest.renderLogin);
router.get("/register", viewsTest.renderRegister);

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
