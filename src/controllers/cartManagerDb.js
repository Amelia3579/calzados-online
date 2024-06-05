const CartModel = require("../models/cart.model.js");
const ProductModel = require("../models/product.model.js");
const mongoose = require("mongoose");

class CartManager {
  //Método para crear carrito
  async createCart(req, res) {
    try {
      const newCart = new CartModel({ products: [] });

      if (newCart) {
        await newCart.save();
        return res.json({
          message: `El carrito ${newCart} fue generado.`,
        });
      } else {
        res.send({
          message:
            "Error al generarse el carrito nuevo. Verificar la operación realizada para su generación.",
        });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para listar carritos creados
  async getCart(req, res) {
    const cart = await CartModel.find();

    try {
      if (!cart) {
        res.send({
          message:
            "No se puede mostrar los carritos. Verificar la operación realizada.",
        });

        return null;
      } else {
        return res.send(JSON.stringify(cart, null, 2));
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para listar productos del carrito según el ID especificado, con renderizado de cart.handlebars
  async getCartById(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await CartModel.findById(cartId).populate(
        "products.product"
      );

      if (!cart) {
        return res.send({
          message: `Error al mostrar el carrito con el ID: ${cartId}.`,
        });
      } else {
        const products = await Promise.all(
          cart.products.map(async (elem) => {
            const product = await ProductModel.findById(elem.product).lean();
            return { ...elem, product };
          })
        );
        res.render("cart", { products });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para agregar productos al carrito, según el ID especificado de ambos items
  async addProductToCart(req, res) {
    try {
      const cartId = req.params.cid;
      const prodId = req.params.pid;
      const quantity = req.body.quantity || 1;

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
      return res.send(JSON.stringify(cart, null, 2));
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para eliminar productos del carrito, según el ID especificado de ambos items
  async deleteProduct(req, res) {
    try {
      const cartId = req.params.cid;
      const prodId = req.params.pid;

      const cart = await CartModel.findById(cartId);

      // Validación para verificar si existe el carrito con el ID especificado
      if (!cart) {
        res.send(`El carrito con el ID: ${cartId} no fue encontrado`);
        return null;
      }

      // Validación para verificar si existe el producto con el ID especificado
      const existProduct = cart.products.findIndex(
        (elem) => elem.product.toString() === prodId
      );

      if (existProduct === -1) {
        res.send(`El producto con el ID: ${prodId} no fue encontrado`);
        return null;
      }

      // Si la cantidad es mayor a 1, descuento en 1 el producto
      if (cart.products[existProduct].quantity > 1) {
        cart.products[existProduct].quantity -= 1;
      } else {
        // Si la cantidad es 1, elimino el producto del array
        cart.products.splice(existProduct, 1);
      }

      // Guardo los cambios en MongoDB
      await cart.save();
      return res.json({
        message: `El producto con el ID: ${prodId} fue eliminado exitosamente del carrito ${cartId}`,
        cart,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para actualizar carrito, según el ID especificado
  async updateProduct(req, res) {
    try {
      const cartId = req.params.cid;
      const updatedProducts = req.body;

      const cart = await CartModel.findById(cartId);

      // Validación para verificar si existe el carrito con el ID especificado
      if (!cart) {
        res.send(`El carrito con el ID: ${cartId} no fue encontrado.`);
        return null;
      }

      // Validación para verificar si existe el producto en el carrito, según el ID especificado
      const existProduct = cart.products.findIndex(
        (item) => item.product.toString() === updatedProducts.product
      );

      if (existProduct !== -1) {
        // Si el producto existe, actualizo su cantidad
        cart.products[existProduct].quantity = updatedProducts.quantity;
      } else {
        // Si el producto no existe, lo agrego al carrito
        cart.products.push({ product, quantity });
      }

      // Guardo los cambios en MongoDB
      await cart.save();

      return res.json({
        message: `El carrito ${cartId} fue actualizado exitosamente`,
        products: cart.products,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para actualizar la cantidad de productos de un carrito, según el ID especificado
  async updateProductDos(req, res) {
    try {
      const cartId = req.params.cid;
      const prodId = req.params.pid;
      const quantity = req.body.quantity;

      // Validación para verificar si existe el carrito con el ID especificado
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        console.log(`El carrito con el ID: ${cartId} no fue encontrado.`);
        return null;
      }

      // Validación para verificar si existe el producto con el ID especificado
      const existProduct = cart.products.findIndex(
        (item) => item.product.toString() === prodId
      );

      if (existProduct !== -1) {
        // Si el producto existe, actualizo su cantidad
        cart.products[existProduct].quantity = quantity;
      } else {
        // Si el producto no existe, lo agrego al carrito
        cart.products.push({ prodId, quantity });
      }

      cart.markModified("products");
      await cart.save();

      return res.json({
        message: `El carrito ${cartId} fue actualizado exitosamente`,
        products: cart.products,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para eliminar productos del carrito, según el ID especificado
  async deleteProductDos(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await CartModel.findById(cartId);

      // Validación para verificar si existe el carrito con el ID especificado
      if (!cart) {
        res.send(`El carrito con el ID: ${cartId} no fue encontrado.`);
        return null;
      } else {
        // Elimino los productos del array del carrito especificado
        cart.products = [];
      }

      // Guardo los cambios en MongoDB
      await cart.save();

      return res.json({
        message: `El carrito con el ID: ${cartId} fue vaciado.`,
        cart: cart.products,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
}
module.exports = CartManager;
