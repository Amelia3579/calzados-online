// // Actividades desafío4 (Websockets)
const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/productManager.js");

const productTest = new ProductManager("./src/models/array-product.json");

//Ruta para Vista de home.handlebars
// router.get("/", async (req, res) => {
//   try {
//     const { status, products } = await productTest.readJson();

//     if (status && products) {
//       return res.status(200).render("home", { products });
//     } else {
//       res.status(404).render("no_products_found");
//     }
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

//Ruta para Vista de realtimeproducts.handlebars
router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

//Actividad desafío complementario (MongoDB)
//Ruta para la Vista de chat.handlebars
router.get("/", (req, res) => {
  res.render("chat");
});

module.exports = router;
