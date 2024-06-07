const CartModel = require("../models/cart.model.js");
const ProductModel = require("../models/product.model.js");
const mongoose = require("mongoose");

class CartRepository {
  //Método para crear carrito
  async addCart() {
    try {
      const newCartR = new CartModel({ products: [] });

      return await newCartR.save();
    } catch (error) {
      throw new Error("Error al crear el carrito");
    }
  }

  //Método para listar los carritos creados
  async find() {
    try {
      return await CartModel.find();
    } catch (error) {
      throw new Error("Error al intentar mostrar los carritos: ");
    }
  }

  //Método para listar productos del carrito según el ID especificado, con renderizado de cart.handlebars
  async findById(cartId) {
    try {
      return await CartModel.findById(cartId).populate("products.product");
    } catch (error) {
      throw new Error("Error al intentar mostrar los productos: ");
    }
  }
}

module.exports = CartRepository;
