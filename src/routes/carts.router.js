//Actividades 1° pre-entrega y desafío complementario
const express = require("express");
const router = express.Router();

const CartManager = require("../controllers/cartManagerDb.js");
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

//Ruta para listar carritos
router.get("/", async (req, res) => {
  try {
    const availableProd = await cartTest.getCart();

    if (availableProd) {
      res.json(availableProd);
    } else {
      return res.json({
        error: "Error al mostrar los carritos"
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
    const cart = await cartTest.getCartById(cartId);

    if (cart) {
      return res.json(cart.products);
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
          "Error al agregar el producto. El nombre del producto y el identificador del carrito tienen que estar especificados.",
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
          "Error al agregar el producto. Verifique los datos proporcionados.",
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Exportación
module.exports = router;
