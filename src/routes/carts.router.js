const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller.js");
const cartTest = new CartController();
const passport = require("passport");
//Middleware de autenticación con JWT
const authenticateJWT = passport.authenticate("jwt", { session: false });
//Verificación del rol
const verifyRole = require("../config/verifyRole.config.js");

//Estructuración por capas
router.post("/", cartTest.createCart);
router.get("/", cartTest.getCart);
router.get("/:cid", cartTest.getCartById);
router.post(
  "/:cid?/product/:pid?",
  verifyRole(["User", "Premium"]),
  authenticateJWT,
  cartTest.addProductToCart
);
router.delete("/:cid?/product/:pid?", cartTest.deleteProduct);
router.put("/:cid", cartTest.updateCartProduct);
router.put("/:cid?/product/:pid?", cartTest.updateQuantityProduct);
router.delete("/:cid", cartTest.emptyCart);
router.post("/:cid/purchase", cartTest.completePurchase);

module.exports = router;
