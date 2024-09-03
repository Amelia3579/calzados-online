const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller.js");
const productTest = new ProductController();
const passport = require("passport");
//Middleware de autenticación con JWT
const authenticateJWT = passport.authenticate("jwt", { session: false });

//Estructuración por capas
router.get("/mockingproducts", productTest.getProductsFaker);
router.get("/", productTest.getProducts);
router.get("/:pid", productTest.getProductById);
router.post("/addproducts", authenticateJWT, productTest.addProduct);
router.put("/:pid", productTest.updateProduct);
router.delete("/:pid", productTest.deleteProduct);

module.exports = router;
