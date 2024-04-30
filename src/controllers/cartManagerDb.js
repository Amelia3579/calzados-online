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
        console.log("Los carritos fueron listados exitosamente");
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

  //Método para eliminar al producto según el ID especificado
  async deleteProduct(cartId, prodId) {
    try {
      const cart = await CartModel.findById(cartId);

      // Validación para verificar si existe el carrito con el ID especificado
      if (!cart) {
        console.log("El carrito no fue encontrado.");
        return null;
      }

      // Validación para verificar si existe el producto con el ID especificado
      const existProduct = cart.products.findIndex(
        (elem) => elem.product.toString() === prodId
      );

      if (existProduct === -1) {
        console.log("El producto ingresado no se encontró en el carrito.");
        return null;
      }

      // Elimino el producto del array de productos del carrito
      cart.products.splice(existProduct, 1);

      // Guardo los cambios en MongoDB
      await cart.save();

      console.log(
        `El producto con el ID: ${prodId} fue eliminado del carrito.`
      );
      return cart;
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  }

  //Método para actualizar carrito, según el ID especificado
  async updateProd(cartId, updatedProduct) {
    try {
      // const cart = await CartModel.findById(cartId);
      const updateProd = await CartModel.findByIdAndUpdate(
        cartId,
        { $push: { products: updatedProduct } },
        { new: true }
      );

      if (!updateProd) {
        console.log(`El carrito con el ID: ${cartId} no fue encontrado.`);
        return null;
      } else {
        console.log("El carrito fue actualizado correctamente.");
        return updateProd;
      }
    } catch (error) {
      throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
  }

  //Método para la cantidad de productos de un carrito, según el ID especificado
  async updateProd(cartId, prodId, quantity) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        console.log(`El carrito con el ID: ${cartId} no fue encontrado.`);
        return null;
      }
      
      const existProduct = cart.products.find(
        (elem) => elem.product.toString() === prodId
      );

      if (!existProduct) {
        console.log(`El producto con el ID: ${prodId} no fue encontrado.`);
      } else {
        existProduct.quantity = quantity;
      }

      cart.markModified("products");
      await cart.save();

      return cart;
    } catch (error) {
      throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
  }

  //Método para eliminar todos los productos del carrito, según el ID especificado
  async deleteProd(cartId) {
    try {
      const cart = await CartModel.findById(cartId);

      // Validación para verificar si existe el carrito con el ID especificado
      if (!cart) {
        console.log("El carrito no fue encontrado.");
        return null;
      }
      // Elimino los productos del array del carrito especificado
      cart.products = [];

      // Guardo los cambios en MongoDB
      await cart.save();

      console.log(
        `Los productos del carrito con el ID: ${cartId} fueron eliminados.`
      );
      return cart;
    } catch (error) {
      throw new Error(`Error al eliminar los productos: ${error.message}`);
    }
  }
}

//Exporto la clase para que sea utilizada por app.js
module.exports = CartManager;
