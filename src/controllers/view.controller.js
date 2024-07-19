const ProductModel = require("../models/product.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();

class ViewsController {
  //------Lógica para Envío de Emails (3° Práctica Integradora)------

  async renderResetPassword(req, res) {
    try {
      res.render("resetPassword");
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
