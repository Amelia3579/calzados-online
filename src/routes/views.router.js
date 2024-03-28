// Actividades desafío4 (Websockets)
const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/productManager.js");

const productTest = new ProductManager("./src/models/array-product.json");

//Vista con Handlebars
router.get("/", async (req, res) => {
  try {
    const { status, products } = await productTest.readJson();

    if (status && products) {
      return res.status(200).render("home", { products });
    } else {
      res.status(404).render("no_products_found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Vista con Websockets
router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

module.exports = router;
