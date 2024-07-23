const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cartManagerDb.js");
const cartTest = new CartManager();
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
router.put("/:cid", cartTest.updateProduct);
router.put("/:cid?/product/:pid?", cartTest.updateProductDos);
router.delete("/:cid", cartTest.deleteProductDos);
router.post("/:cid/purchase", cartTest.purchaseCart);

module.exports = router;
