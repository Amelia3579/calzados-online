const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/productManager.js");

const productTest = new ProductManager("./src/models/array-product.json");

router.get("/", async (req, res) => {
  try {
    const products = await productTest.readJson();
    res.render("home",  { products } );
  } catch (error) {
    res.status(500).send({ message: "Error al mostrar los productos" });
  }
});

module.exports = router;
