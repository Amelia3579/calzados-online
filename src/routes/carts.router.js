const express = require("express");
const router = express.Router();
const CartManager = require("../cartManager.js");
const cartTest = new CartManager("./src/cart.json");


//1)Generar carrito nuevo
router.post("/", async (req, res) => {
  const newCart = await cartTest.createCart();
  try {
    res.json(newCart);
  } catch (error) {
    res.status(500).send({ message: "Error al crear el carrito" });
  }
});

//2)Listar productos de un carrito determinado
router.get("/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  try {
    const cart = await cartTest.getCartById(cartId);
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ message: "Error al listar el carrito" });
  }
});

//3)Agregar productos al carrito del ID ingresado
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const prodId = parseInt(req.params.pid);
  const quantity = req.body.quantity || 1;

  try {
    const updateCart = await cartTest.addProdCart(cartId, prodId, quantity);
    res.status(201).json(updateCart.products);
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error); 
    res.status(500).json({ message: "Error al agregar el producto al carrito", error: error.message });
  }
});

//Tenemos que exportarlo
module.exports = router;
