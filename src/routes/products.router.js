const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/productManagerDb.js");
const productTest = new ProductManager();

//Estructuración por capas
router.get("/", productTest.getProducts);
router.get("/:id", productTest.getProductById);
router.post("/", productTest.addProduct);
router.put("/:id", productTest.updateProduct);
router.delete("/:id", productTest.deleteProduct);
router.get("/mockingproducts", productTest.generateProductsFocker);

module.exports = router;
