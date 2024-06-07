const { cartRepository, productRepository } = require("../services/index.js");
const mongoose = require("mongoose");

class CartManager {
  //Método para crear carrito
  async createCart(req, res) {
    try {
      const newCart = await cartRepository.addCart();

      if (newCart) {
        return res.status(200).send({
          success: true,
          message: "El carrito fue generado exitosamente.",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "El carrito no se pudo generar.",
        });
      }
    } catch (error) {
      return res.status(500).send({
        message: `${error.message}`,
      });
    }
  }

  //Método para listar los carritos creados
  async getCart(req, res) {
    const searchedCart = await cartRepository.find();

    try {
      if (!searchedCart) {
        res.status(404).send({
          success: false,
          message:
            "No se pueden mostrar los carritos. Verificá la operación que realizaste.",
        });
        return null;
      } else {
        return res.status(200).json({
          success: true,
          message: "Los carritos disponibles son: ",
          carts: JSON.parse(JSON.stringify(searchedCart, null, 2)),
        });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para listar productos del carrito según el ID especificado, con renderizado de cart.handlebars
  async getCartById(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await cartRepository.findById(cartId);

      if (!cart) {
        return res.status(404).send({
          success: false,
          message: `Error al mostrar el carrito con el ID: ${cartId}.`,
        });
      } else {
        const products = await Promise.all(
          cart.products.map(async (elem) => {
            const product = await productRepository.findById(elem.product);
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

      const searchedCart = await cartRepository.findById(cartId);
      console.log(searchedCart);
      const searchedProduct = searchedCart.products.find(
        (elem) => elem.product._id.toString() === prodId
      );

      if (searchedProduct) {
        searchedProduct.quantity += quantity;
      } else {
        searchedCart.products.push({ product: prodId, quantity });
      }

      //Marco la propiedad products como modificada
      searchedCart.markModified("products");

      await searchedCart.save();
      return res.send(JSON.stringify(searchedCart, null, 2));
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para eliminar productos del carrito, según el ID especificado de ambos items
  async deleteProduct(req, res) {
    try {
      const cartId = req.params.cid;
      const prodId = req.params.pid;

      const searchedCart = await cartRepository.findById(cartId);

      // Validación para verificar si existe el carrito con el ID especificado
      if (!searchedCart) {
        res.status(404).send({
          success: false,
          message: `El carrito con el ID: ${cartId} no fue encontrado. Verificar el identificador ingresado.`,
        });
        // res.send(`El carrito con el ID: ${cartId} no fue encontrado`);
        return null;
      }

      // Validación para verificar si existe el producto con el ID especificado
      const searchedProduct = searchedCart.products.findIndex(
        (elem) => elem.product._id.toString() === prodId
      );

      if (searchedProduct === -1) {
        res.status(404).send({
          success: false,
          message: `El producto con el ID: ${prodId} no fue encontrado. Verificar el identificador ingresado.`,
        });
        return null;
      }

      // Si la cantidad es mayor a 1, descuento en 1 el producto
      if (searchedCart.products[searchedProduct].quantity > 1) {
        searchedCart.products[searchedProduct].quantity -= 1;
      } else {
        // Si la cantidad es 1, elimino el producto del array
        searchedCart.products.splice(searchedProduct, 1);
      }

      // Guardo los cambios en MongoDB
      await searchedCart.save();
      return res.status(200).json({
        message: `El producto con el ID: ${prodId} fue eliminado exitosamente del carrito ${cartId}`,
        searchedCart,
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

      const searchedCart = await cartRepository.findById(cartId);

      // Validación para verificar si existe el carrito con el ID especificado
      if (!searchedCart) {
        res.status(404).send({
          success: false,
          message: `El carrito con el ID: ${cartId} no fue encontrado. Verificar el identificador ingresado.`,
        });
        return null;
      }

      // Validación para verificar si existe el producto en el carrito, según el ID especificado
      const searchedProduct = searchedCart.products.findIndex(
        (elem) => elem.product._id.toString() === updatedProducts.product
      );

      if (searchedProduct !== -1) {
        // Si el producto existe, actualizo su cantidad
        searchedCart.products[searchedProduct].quantity =
          updatedProducts.quantity;
      } else {
        // Si el producto no existe, lo agrego al carrito
        searchedCart.products.push({ product, quantity });
      }

      // Guardo los cambios en MongoDB
      await searchedCart.save();

      return res.status(200).json({
        success: true,
        message: `El carrito ${cartId} fue actualizado exitosamente.`,
        products: JSON.parse(JSON.stringify(searchedCart.products, null, 2)),
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
      const searchedCart = await cartRepository.findById(cartId);

      if (!searchedCart) {
        res.status(404).send({
          success: false,
          message: `El carrito con el ID: ${cartId} no fue encontrado. Verificar el identificador ingresado.`,
        });
        return null;
      }

      // Validación para verificar si existe el producto con el ID especificado
      const searchedProduct = searchedCart.products.findIndex(
        (item) => item.product._id.toString() === prodId
      );

      if (searchedProduct !== -1) {
        // Si el producto existe, actualizo su cantidad
        searchedCart.products[searchedProduct].quantity = quantity;
      } else {
        // Si el producto no existe, lo agrego al carrito
        searchedCart.products.push({ prodId, quantity });
      }

      searchedCart.markModified("products");
      await searchedCart.save();

      return res.status(200).json({
        success: true,
        message: `El carrito ${cartId} fue actualizado exitosamente.`,
        products: JSON.parse(JSON.stringify(searchedCart.products, null, 2)),
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para eliminar productos del carrito, según el ID especificado
  async deleteProductDos(req, res) {
    try {
      const cartId = req.params.cid;
      const searchedCart = await cartRepository.findById(cartId);

      // Validación para verificar si existe el carrito con el ID especificado
      if (!searchedCart) {
        res.status(404).send({
          success: false,
          message: `El carrito con el ID: ${cartId} no fue encontrado. Verificar el identificador ingresado.`,
        });
        return null;
      } else {
        // Vacío el carrito especificado
        searchedCart.products = [];
      }

      // Guardo los cambios en MongoDB
      await searchedCart.save();

      return res.status(200).json({
        message: `El carrito con el ID: ${cartId} fue vaciado.`,
        cart: searchedCart.products,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
}
module.exports = CartManager;
