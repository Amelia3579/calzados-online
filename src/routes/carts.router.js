const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cartManagerDb.js");
const cartTest = new CartManager();

//Estructuración por capas
router.post("/", cartTest.createCart);
router.get("/", cartTest.getCart);
router.get("/:cid", cartTest.getCartById);
router.post("/:cid?/product/:pid?", cartTest.addProductToCart);
router.delete("/:cid?/product/:pid?", cartTest.deleteProduct);
router.put("/:cid", cartTest.updateProduct);
router.put("/:cid?/product/:pid?", cartTest.updateProductDos);
router.delete("/:cid", cartTest.deleteProductDos);

module.exports = router;
