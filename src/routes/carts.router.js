const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cartManager.js");
const cartTest = new CartManager("./src/cart.json");

//1)Generar carrito nuevo
router.post("/", async (req, res) => {
  try {
    const newCart = await cartTest.createCart();

    if (newCart) {
      res.status(200).send(newCart);
    } else {
      res.status(400).send({
        message:
          "Error al generarse el carrito nuevo. Verificar la operación realizada para su generación.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al crear el carrito" });
  }
});

//2)Listar productos de un carrito determinado
router.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartTest.getCartById(cartId);

    if (cart) {
      res.status(200).json(cart.products);
    } else {
      res
        .status(400)
        .send({
          message:
            "Error al buscar el identificador del carrito. Verificar número ingresado.",
        });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al listar el carrito" });
  }
});

//3)Agregar productos al carrito del ID ingresado
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const prodId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;

    const updateCart = await cartTest.addProdCart(cartId, prodId, quantity);

    if (updateCart) {
      res.status(200).json(updateCart.products);
    } else {
      res
        .status(404)
        .send({
          message:
            "Error al agregar el producto. Verificar si ingresaste el identificador del producto, su título y su cantidad.",
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
