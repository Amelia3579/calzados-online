const ProductManager = require("../controllers/productManager.js");
const express = require("express");
const router = express.Router();

const productTest = new ProductManager("./src/models/array-product.json");
//Actividades desafío3
//Establezco la ruta products & limit
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

//Establezco la ruta /:id
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

//Actividades 1° pre-entrega
//Ruta para agregar productos
router.post("/", async (req, res) => {
  try {
    //Capturo datos que vienen del body
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

//Ruta para actualizar producto según ID especificado
router.put("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const putProductBody = req.body;

    //Validación para verificar si existe  el producto correspondiente al ID especificado
    const productExists = await productTest.productExists(productId);
    if (!productExists) {
      return res.status(404).send({
        message:
          "El producto no fue encontrado. Verificar el identificador ingresado",
      });
    }

    await productTest.updateProduct(productId, putProductBody);

    res.status(201).send({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(500).send({ message: "Error al actualizar el producto." });
  }
});

//Ruta para eliminar producto según ID especificado
router.delete("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const putProductBody = req.body;

    //Validación para verificar si existe  el producto correspondiente al ID especificado
    const productExists = await productTest.productExists(productId);
    if (!productExists) {
      return res.status(404).send({
        message:
          "El producto no fue encontrado. Verificar el identificador ingresado",
      });
    }

    await productTest.deleteProduct(productId, putProductBody);

    res.status(201).send({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).send({ message: "Error al eliminar el producto" });
  }
});
//Exportación
module.exports = router;
