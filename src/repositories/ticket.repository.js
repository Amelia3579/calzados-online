const { TicketModel } = require("../models/ticket.model.js");
const mongoose = require("mongoose");

class TicketRepository {
  //Método para crear ticket
  async createTicket(dataTicket) {
    try {
      const newTicket = new TicketModel(dataTicket);
      return await newTicket.save();
    } catch (error) {
      console.error(`Error al crear el ticket: ${error.message}`);
      throw new Error("Error al crear el ticket");
    }
  }
}

module.exports = TicketRepository;
