//Actividades 1° pre-entrega y desafío complementario
const express = require("express");
const router = express.Router();

const CartManager = require("../controllers/cartManagerDb.js");
const CartModel = require("../models/cart.model.js");
const cartTest = new CartManager();

//Ruta para generar carrito nuevo
router.post("/", async (req, res) => {
  try {
    const newCart = await cartTest.createCart();

    if (newCart) {
      return res.json(newCart);
    } else {
      res.send({
        message:
          "Error al generarse el carrito nuevo. Verificar la operación realizada para su generación.",
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Ruta para listar todos los carritos
router.get("/", async (req, res) => {
  try {
    const availableProd = await cartTest.getCart();

    if (availableProd) {
      res.json(availableProd);
    } else {
      return res.json({
        error: "Error al mostrar los carritos",
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Ruta para listar productos del carrito según el ID especificado
router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await CartModel.findById(cartId).populate("products.product");
    
    if (cart) {
      return res.json(cart);
    } else {
      res.send({
        message:
          "Error al buscar el identificador del carrito. Verificar número ingresado.",
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Ruta para agregar productos al carrito, según el ID especificado de ambos items
router.post("/:cid?/product/:pid?", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const quantity = req.body.quantity || 1;

    // Validación para verificar que el título del producto y el id del carrito estén incluídos en la solicitud
    if (!prodId || !cartId) {
      return res.status(404).json({
        message:
          "Error al agregar el producto. Los identificadores del carrito y del producto tienen que estar especificados.",
      });
    }

    //Agrego productos al carrito, según el ID especificado de ambos items
    const addProd = await cartTest.addProdCart(cartId, prodId, quantity);

    if (addProd) {
      return res.status(200).json({
        products: addProd.products,
      });
    } else {
      res.status(400).json({
        message:
          `Error al agregar el producto con el ID: ${prodId}. Verifique los datos proporcionados.`,
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Actividades 2° pre-entrega
//Ruta para eliminar productos del carrito, según el ID especificado de ambos items
router.delete("/:cid?/product/:pid?", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const prodId = req.params.pid;

    //Elimino producto del carrito, según el ID especificado
    const deleteProd = await cartTest.deleteProduct(cartId, prodId);

    if (deleteProd) {
      return res.status(200).json({
        message: "El producto fue eliminado exitosamente",
        products: deleteProd.products,
      });
    } else {
      res.status(400).json({
        message:
          `Error al eliminar el producto con el ID: ${prodId}. Verifique los datos proporcionados.`,
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Ruta para actualizar carrito, según el ID especificado de carrito
router.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const putProductBody = req.body;

    const updateProd = await cartTest.updateProd(cartId, putProductBody);

    if (updateProd) {
      return res.status(200).json({
        message: "El carrito fue actualizado exitosamente",
        products: updateProd.products,
      });
    } else {
      res.status(400).json({
        message:
          `Error al actualizar el carrito con el ID: ${cartId}. Verifique los datos proporcionados.`,
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Ruta para actualizar cantidad de producto de un carrito, según el ID especificado de ambos items
router.put("/:cid?/product/:pid?", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
   
    const quantity = req.body.quantity
    
    const updateProd = await cartTest.updateProd(cartId, prodId, quantity);

    if (updateProd) {
      return res.status(200).json({
        message: "La cantidad del producto fue actualizada exitosamente",
        products: updateProd.products,
      });
    } else {
      res.status(400).json({
        message:
          `Error al actualizar la cantidad del producto con el ID: ${prodId}. Verifique los datos proporcionados.`,
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Ruta para eliminar todos los productos del carrito, según el ID especificado de carrito
router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    //Elimino producto del carrito, según el ID especificado
    const deleteP = await cartTest.deleteProd(cartId);

    if (deleteP) {
      return res.status(200).json({
        message: "Los productos del carrito fueron eliminados exitosamente",
        products: deleteP.products,
      });
    } else {
      res.status(400).json({
        message:
          `Error al eliminar los productos del carrito con el ID ${cartId}: . Verifique los datos proporcionados.`,
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});
//Exportación
module.exports = router;
