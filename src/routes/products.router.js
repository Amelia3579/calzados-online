const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/productManagerDb.js");
const productTest = new ProductManager();
const ProductModel = require("../models/product.model.js");

//Actividades desafío3, desafío complementario y 2° pre-entrega
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const query = req.query.category;
    const sort = req.query.sort === "1" ? 1 : req.query.sort === "-1" ? -1 : 0;

    //Defino opciones para sort
    const sortOption = {};
    if (sort !== 0) {
      sortOption.price = sort;
    }

    let availableProd;
    //Validación para recibir query
    if (query) {
      availableProd = await ProductModel.paginate(
        { category: query },
        { limit, page, sort: sortOption }
      );
      //Si no recibo query, brindo la paginación teniendo en cuenta todas las categorías
    } else {
      availableProd = await ProductModel.paginate(
        {},
        { limit, page, sort: sortOption }
      );
    }
   
    //Recibo los docs y los mapeo para que me brinde la información (en reemplazo del método .lean())
    availableProd.docs = availableProd.docs.map(doc => doc.toObject({ getters: false }));

    res.render("home", {
      products: availableProd.docs,
      totalDocs: availableProd.totalDocs,
      limit: availableProd.limit,
      totalPages: availableProd.totalPages,
      page: availableProd.page,
      pagingCounter: availableProd.pagingCounter,
      currentPage: availableProd.page,
      hasPrevPage: availableProd.hasPrevPage,
      hasNextPage: availableProd.hasNextPage,
      prevPage: availableProd.prevPage,
      nextPage: availableProd.nextPagePage,
    })

  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Establezco la ruta /:id
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const availableProd = await productTest.getProductById(id);

    if (!availableProd) {
      return res.json({
        error: `Producto con el ${productId} no fue encontrado.`,
      });
    } else {
      res.json(availableProd);
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Actividades 1° pre-entrega
//Ruta para agregar productos
router.post("/", async (req, res) => {
  try {
    //Capturo datos que vienen del body
    const addProductBody = req.body;

    if (Object.keys(addProductBody).length === 0) {
      return res.status(404).send({
        message:
          "El cuerpo de la solicitud está vacío. Ingresar los datos requeridos.",
      });
    }

    await productTest.addProduct(addProductBody);
    res.status(201).send({ message: "Producto ingresado correctamente" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Ruta para actualizar producto según ID especificado
router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const putProductBody = req.body;

    // Validación para verificar si existe  el producto con el ID especificado
    const productExists = await productTest.productExists(productId);

    if (!productExists) {
      return res.status(404).send({
        message: `El producto con el ID ${productId} no fue encontrado. Verificar el identificador ingresado.`,
      });
    }

    await productTest.updateProduct(productId, putProductBody);
    res.status(201).send({
      message: `El producto con el ID: ${productId} fue actualizado correctamente.`,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Ruta para eliminar producto según ID especificado
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const putProductBody = req.body;

    //Validación para verificar si existe  el producto correspondiente al ID especificado
    const productExists = await productTest.productExists(productId);

    if (!productExists) {
      return res.status(404).send({
        message: `El producto con el ID: ${productId} no fue encontrado. Verificar el identificador ingresado.`,
      });
    }

    await productTest.deleteProduct(productId, putProductBody);
    res
      .status(201)
      .send({ message: `El producto con el ID: ${productId} fue eliminado.` });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});
//Exportación
module.exports = router;
