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

const passport = require("passport");
//Verificación del rol
const verifyRole = require("../config/verifyRole.config.js");
//Middleware de autenticación con JWT
const authenticateJWT = passport.authenticate("jwt", { session: false });

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

module.exports = router;
