//Actividades del desafío complementario
const CartModel = require("../models/cart.model.js");
const { id } = require("./cartManager.js");

class CartManager {
  //Método para crear carrito
  async createCart() {
    try {
      const newCart = new CartModel({ products: [] });

      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear un nuevo carrito: ${error.message}`);
    }
  }

  //Método para listar carritos creados
  async getCart() {
    const cart = await CartModel.find();

    try {
      if (!cart) {
        console.log("Los carritos no pueden ser mostrados.");
        return null;
      } else {
        console.log("Los carritos pueden ser listados correctamente.");
        return cart;
      }
    } catch (error) {
      throw new Error(`Error al crear un nuevo carrito: ${error.message}`);
    }
  }

  //Método para listar productos del carrito según el ID especificado
  async getCartById(cartId) {
    try {
      const cart2 = await CartModel.findById(cartId);

      if (!cart2) {
        console.log(`El carrito con el ID: ${id} no fue encontrado.`);
        return null;
      } else {
        console.log(`El carrito con el ID: ${id} fue encontrado.`);
        return cart2;
      }
    } catch (error) {
      throw new Error(`Error al crear un nuevo carrito: ${error.message}`);
    }
  }

  //Método para agregar productos al carrito, según el ID especificado de ambos items
  async addProdCart(cartId, prodId, quantity = 1) {
    try {
      const cart = await CartModel.findById(cartId);
      const existProduct = cart.products.find(
        (elem) => elem.product.toString() === prodId
      );

      if (existProduct) {
        existProduct.quantity += quantity;
      } else {
        cart.products.push({ product: prodId, quantity });
      }

      //Marco la propiedad products como modificada
      cart.markModified("products");

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(
        `Error al agregar el producto con el ID: ${prodId} al carrito ID:  ${cartId}: ${error.message}`
      );
    }
  }
}

//Exporto la clase para que sea utilizada por app.js
module.exports = CartManager;
