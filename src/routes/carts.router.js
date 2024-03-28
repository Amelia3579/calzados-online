//Actividades 1° pre-entrega
const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cartManager.js");
const cartTest = new CartManager("./src/models/cart.json");

//1)Generar carrito nuevo
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
    res.json(error.message);
  }
});

//2)Listar productos del carrito correspondiente al ID especificado
router.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
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
    res.json({ message: "Error al listar el carrito" });
  }
});

//3)Agregar productos al carrito del ID ingresado
router.post("/:cid?/product/:pid?", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const prodId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;

    // Validación para verificar que el título del producto y el id del carrito estén incluídos en la solicitud
    if (!prodId || !cartId) {
      return res.status(404).json({
        message:
          "Error al agregar el producto. El nombre del producto y el identificador del carrito tienen que estar especificados.",
      });
    }

    // Agregar el producto al carrito especificado
    const updateCart = await cartTest.addProdCart(cartId, prodId, quantity);

    if (updateCart) {
      return res.status(200).json({
        message: "Producto agregado al carrito exitosamente",
        products: updateCart.products,
      });
    } else {
      res.status(400).json({
        message:
          "Error al agregar el producto. Verifique los datos proporcionados.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error al agregar el producto al carrito",
      error: error.message,
    });
  }
});

//Tenemos que exportarlo
module.exports = router;
