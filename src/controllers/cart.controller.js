const {
  cartRepository,
  productRepository,
  ticketRepository,
} = require("../services/index.js");
const mongoose = require("mongoose");
const totalPurchase = require("../utils/ticket.js");
const { generateUniqueCode } = require("../models/ticket.model.js");

class CartController {
  //Método para crear carrito
  async createCart(req, res) {
    try {
      const newCart = await cartRepository.addCart();

      if (newCart) {
        return res.status(201).send({
          status: "success",
          message: "The shopping cart was successfully created.",
          payload: newCart,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "The cart could not be created.",
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
    const cart = await cartRepository.find();

    try {
      if (!cart) {
        res.status(404).send({
          success: false,
          message:
            "The carts cannot be displayed because they were not found. Please check if the operation you performed is correct.",
        });
        return null;
      } else {
        return res.status(200).json({
          success: true,
          message: "The available carts are: ",
          carts: JSON.parse(JSON.stringify(cart, null, 2)),
        });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para listar carrito según el ID especificado
  async getCartById(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await cartRepository.findById(cartId);

      if (!cart) {
        return res.status(404).send({
          success: false,
          message: `The cart with the ID ${cartId} cannot be displayed because it was not found.`,
        });
      }

      return res.status(200).json({
        success: true,
        message: "The available carts are: ",
        carts: JSON.parse(JSON.stringify(cart, null, 2)),
      });
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
      const user = req.user;

      const cart = await cartRepository.findById(cartId);
      // Verifico si el carrito existe
      if (!cart) {
        return res.status(404).send({
          success: false,
          message: `The cart with the ID ${cartId} was not found.`,
        });
      }

      // Busco el producto en la base de datos
      const product = await productRepository.findById(prodId);
      if (!product) {
        return res.status(404).send({
          success: false,
          message: `The product with the ID ${prodId} was not found.`,
        });
      }

      // Verifico si el producto pertenece al usuario premium
      if (user.role === "Premium" && product.owner === user.email) {
        return res.status(403).send({
          success: false,
          message: "You can't add your products to your cart.",
        });
      }

      const productInCart = cart.products.find(
        (elem) => elem.product._id.toString() === prodId
      );

      if (productInCart) {
        productInCart.quantity += quantity;
      } else {
        cart.products.push({ product: prodId, quantity });
      }

      //Marco la propiedad products como modificada
      cart.markModified("products");

      await cart.save();
      res.redirect(`/carts/${cart._id}`);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para eliminar productos del carrito, según el ID especificado de ambos items
  async deleteProduct(req, res) {
    try {
      const cartId = req.params.cid;
      const prodId = req.params.pid;

      const cart = await cartRepository.findById(cartId);

      // Validación para verificar si existe el carrito con el ID especificado
      if (!cart) {
        res.status(404).send({
          success: false,
          message: `The cart with the ID ${cartId} was not found.`,
        });
        return null;
      }

      // Validación para verificar si existe el producto con el ID especificado
      const productIndex = cart.products.findIndex(
        (elem) => elem.product._id.toString() === prodId
      );

      if (productIndex === -1) {
        res.status(404).send({
          success: false,
          message: `The product with the ID ${prodId} was not found.`,
        });
        return null;
      }

      // Si la cantidad es mayor a 1, descuento en 1 el producto
      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
      } else {
        // Si la cantidad es 1, elimino el producto del array
        cart.products.splice(productIndex, 1);
      }

      // Guardo los cambios en MongoDB
      await cart.save();
      return res.status(200).json({
        message: `The product with the ID ${prodId} was successfully deleted at the cart${cartId}`,
        cart,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para actualizar carrito, según el ID especificado
  async updateCartProduct(req, res) {
    try {
      const cartId = req.params.cid;
      const updatedProduct = req.body;

      const cart = await cartRepository.findById(cartId);

      // Validación para verificar si existe el carrito con el ID especificado
      if (!cart) {
        res.status(404).send({
          success: false,
          message: `The cart with the ID ${cartId} was not found.`,
        });
        return null;
      }

      // Validación para verificar si existe el producto en el carrito, según el ID especificado
      const productIndex = cart.products.findIndex(
        (elem) => elem.product._id.toString() === updatedProduct.product
      );

      if (productIndex !== -1) {
        // Si el producto existe, actualizo su cantidad
        cart.products[productIndex].quantity = updatedProduct.quantity;
      } else {
        // Si el producto no existe, lo agrego al carrito
        cart.products.push({ product, quantity });
      }

      // Guardo los cambios en MongoDB
      await cart.save();

      return res.status(200).json({
        success: true,
        message: `The cart ${cartId} was successfully updated.`,
        products: JSON.parse(JSON.stringify(cart.products, null, 2)),
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para actualizar la cantidad de productos de un carrito, según el ID especificado
  async updateQuantityProduct(req, res) {
    try {
      const cartId = req.params.cid;
      const prodId = req.params.pid;
      const quantity = req.body.quantity;

      // Validación para verificar si existe el carrito con el ID especificado
      const cart = await cartRepository.findById(cartId);

      if (!cart) {
        res.status(404).send({
          success: false,
          message: `The cart with the ID ${cartId} was not found.`,
        });
        return null;
      }

      // Validación para verificar si existe el producto con el ID especificado
      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === prodId
      );

      if (productIndex !== -1) {
        // Si el producto existe, actualizo su cantidad
        cart.products[productIndex].quantity = quantity;
      } else {
        // Si el producto no existe, lo agrego al carrito
        cart.products.push({ prodId, quantity });
      }

      cart.markModified("products");
      await cart.save();

      return res.status(200).json({
        success: true,
        message: `The product quantity was updated successfully.`,
        products: JSON.parse(JSON.stringify(cart.products, null, 2)),
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para vaciar el carrito, según el ID especificado
  async emptyCart(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await cartRepository.findById(cartId);

      // Validación para verificar si existe el carrito con el ID especificado
      if (!cart) {
        res.status(404).send({
          success: false,
          message: `The cart with the ID ${cartId} was not found.`,
        });
        return null;
      } else {
        // Vacío el carrito especificado
        cart.products = [];
      }

      // Guardo los cambios en MongoDB
      await cart.save();

      return res.status(200).json({
        message: `The cart with ID: ${cartId} was emptied.`,
        cart: cart.products,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
  //------Actividad 3° pre-entrega y lógica para Logger------

  //Método para verificar el stock del producto, antes de confirmar la compra
  async purchaseCart(req, res) {
    const cartId = req.params.cid;
    const purchaserEmail = req.body.email;

    try {
      //Busco el carrito por su ID
      const cart = await cartRepository.findById(cartId);

      //Array para almacenar los productos no disponibles
      const productsNotAvailable = [];

      if (!cart) {
        req.logger.warning(`The cart with the ID ${cartId} was not found.`);
        return res
          .status(404)
          .json({ success: false, message: "The cart was not found." });
      }

      // Verifico el stock de cada producto en el carrito
      for (const item of cart.products) {
        const product = item.product;
        const productId = await productRepository.findById(product);

        // Verifico si hay suficiente stock
        if (productId && productId.toObject) {
          if (productId.stock >= item.quantity) {
            // Resto la cantidad del stock del producto
            productId.stock -= item.quantity;
            await productId.save();

            req.logger.info(`The product ${product} was successfully updated.`);
          } else {
            // Si no hay suficiente stock, el producto, sea agrega a productsNotAvailable
            productsNotAvailable.push(product);

            req.logger.warning(
              `The product ${product} is not available in sufficient quantity.`
            );
          }
        }
      }

      //Creo un ticket con los datos de la compra realizada
      const uniqueCode = await generateUniqueCode();
      const totalAmount = totalPurchase(cart.products); //Total de la compra usando función totalPurchase
      const newTicket = await ticketRepository.createTicket({
        code: uniqueCode,
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: purchaserEmail,
      });

      req.logger.info(
        `The ticket was generated with the code: ${uniqueCode} for the buyer: ${purchaserEmail}.`
      );

      // Elimino del carrito los productos que se compraron
      cart.products = cart.products.filter((item) =>
        productsNotAvailable.some((product) => product.equals(item.productId))
      );

      // Guardo el carrito actualizado en MongoDB
      await cart.save();

      return res.status(200).json({
        success: true,
        message:
          "The ticket was generated successfully. The products that were not added to the purchase due to lack of stock are:",
        cart: JSON.parse(JSON.stringify(productsNotAvailable, null, 2)),
        ticket: newTicket,
      });
    } catch (error) {
      req.logger.error("Error in the purchase process:", error);
      return res.status(500).send({ message: error.message });
    }
  }
}
module.exports = CartController;
