const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/productManagerDb.js");
const productTest = new ProductManager();

//Estructuración por capas
router.get("/mockingproducts", productTest.getProductsFaker);
router.get("/", productTest.getProducts);
router.get("/:pid", productTest.getProductById);
router.post("/", productTest.addProduct);
router.put("/:pid", productTest.updateProduct);
router.delete("/:pid", productTest.deleteProduct);

module.exports = router;
