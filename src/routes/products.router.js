const ProductManager = require("../controllers/productManager.js");
const express = require("express");
const router = express.Router();

const productTest = new ProductManager("./src/models/array-product.json");
//Se establece la ruta products & limit
router.get("/", async (req, res) => {
  try {
    let availableProd = await productTest.readJson();
    let limit = parseInt(req.query.limit);

    if (!isNaN(limit) && limit > 0) {
      res.send(availableProd.slice(0, limit));
    } else {
      res.send(availableProd);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
});

//Se establece la ruta /:id
router.get("/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let availableProd = await productTest.getProductById(id);

    if (availableProd) {
      res.send(availableProd);
    } else {
      res.send("El producto no fue encontrado");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
});

//Agregar producto
router.post("/", async (req, res) => {
  try {
    //Capturar datos que vienen del body
    const addProductBody = req.body;

    if (Object.keys(addProductBody).length === 0) {
      return res
        .status(400)
        .send({ message: "El cuerpo de la solicitud está vacío" });
    }

    await productTest.addProduct(addProductBody);
    res.status(201).send({ message: "Producto ingresado correctamente" });
  } catch (error) {
    res.status(500).send({ message: "Error al agregar el producto" });
  }
});

//Actualizar producto por ID
router.put("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const putProductBody = req.body;

    await productTest.updateProduct(productId, putProductBody);

    res.status(201).send({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(500).send({ message: "Error al actualizar el producto" });
  }
});

//Eliminar producto por ID
router.delete("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const putProductBody = req.body;

    await productTest.deleteProduct(productId, putProductBody);

    res.status(201).send({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).send({ message: "Error al eliminar el producto" });
  }
});
//Tenemos que exportarlo
module.exports = router;
