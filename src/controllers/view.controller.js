const { cartRepository, productRepository } = require("../services/index.js");

const totalPurchase = require("../utils/ticket.js");

class ViewsController {
  //Método para renderizar cart.handlebars
  async renderCart(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await cartRepository.findById(cartId);
      if (!cart) {
        return res.status(404).send({
          success: false,
          message: `The cart with the ID ${cartId} cannot be displayed because it was not found.`,
        });
      } else {
        const products = await Promise.all(
          cart.products.map(async (elem) => {
            const product = await productRepository.findById(elem.product);
            return { ...elem, product, quantity: elem.quantity };
          })
        );
        const totalAmount = totalPurchase(products);

        res.render("cart", {
          products,
          cart,
          totalPurchase: totalAmount,
        });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para renderizar register.handlebars
  async renderRegister(req, res) {
    try {
      res.render("register");
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para renderizar login.handlebars
  async renderLogin(req, res) {
    try {
      res.render("login");
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para renderizar chat.handlebars
  async renderChat(req, res) {
    try {
      res.render("chat");
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //------Lógica para Envío de Emails (3° Práctica Integradora)------

  async renderResetPassword(req, res) {
    try {
      res.render("resetpassword");
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  async renderChangePassword(req, res) {
    try {
      res.render("changepassword");
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  async renderConfirmation(req, res) {
    try {
      res.render("shippingconfirmation");
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
}

module.exports = ViewsController;
