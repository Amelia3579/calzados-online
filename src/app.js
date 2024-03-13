const ProductManager = require("./productManager.js");
const express = require("express");
const path = require("path");
const app = express();
const PUERTO = 8080;

const productTest = new ProductManager(
  path.join(__dirname, "./array-product.json")
);
//Se establece la ruta products & limit
app.get("/products", async (request, response) => {
  try {
    let availableProd = await productTest.readJson();
    let limit = parseInt(request.query.limit);

    if (!isNaN(limit) && limit > 0) {
      response.send(availableProd.slice(0, limit));
    } else {
      response.send(availableProd);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
});

//Se establece la ruta products/:id
app.get("/products/:id", async (request, response) => {
  try {
    let id = parseInt(request.params.id);
    let availableProd = await productTest.getProductById(id);

    if (availableProd) {
      response.send(availableProd);
    } else {
      response.send("El producto no fue encontrado");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
});

app.listen(PUERTO, () => {
  console.log(`Servidor express en el puerto http://localhost:${PUERTO}`);
});
