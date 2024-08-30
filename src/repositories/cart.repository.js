const CartModel = require("../models/cart.model.js");
const mongoose = require("mongoose");

class CartRepository {
  //Método para crear carrito
  async addCart() {
    try {
      const newCartR = new CartModel({ products: [] });

      return await newCartR.save();
    } catch (error) {
      console.error(`Error creating cart: ${error.message}`);
      throw new Error("Error creating cart");
    }
  }

  //Método para listar los carritos creados
  async find() {
    try {
      return await CartModel.find();
    } catch (error) {
      console.error(`Error displaying carts: ${error.message}`);
      throw new Error("Error displaying carts.");
    }
  }

  //Método para listar productos del carrito según el ID especificado
  async findById(cartId) {
    try {
      return await CartModel.findById(cartId);
    } catch (error) {
      console.error(`Error displaying products
        : ${error.message}`);
      throw new Error("Error displaying products.");
    }
  }

  //Método para vaciar el carrito
  async emptyCart(cartId) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );

      return cart;
    } catch (error) {
      console.error(`Error deleting products to Cart
        : ${error.message}`);
      throw new Error("Error deleting products to Cart.");
    }
  }
}

module.exports = CartRepository;
