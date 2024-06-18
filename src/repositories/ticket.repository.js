const TicketModel = require("../models/ticket.model.js");
const totalPurchasePrice = require("../utils/ticket.js");
const mongoose = require("mongoose");

class TicketRepository {
  //Método para crear ticket
  async createTicket(email) {
    try {
      const newTicket = new TicketModel({
        code: code,
        purchase_datetime: new Date(),
        amount: totalPurchasePrice(cart.products),
        purchaser: email,
      });
      await newTicket.save();
      return newTicket;
    } catch (error) {
      console.error(`Error al crear el ticket: ${error.message}`);
      throw new Error("Error al crear el ticket");
    }
  }
}

module.exports = TicketRepository;
