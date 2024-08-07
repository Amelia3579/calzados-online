const { TicketModel } = require("../models/ticket.model.js");
const mongoose = require("mongoose");

class TicketRepository {
  //Método para crear ticket
  async createTicket(dataTicket) {
    try {
      const newTicket = new TicketModel(dataTicket);
      return await newTicket.save();
    } catch (error) {
      console.error(`Error creating ticket: ${error.message}`);
      throw new Error("Error creating ticket");
    }
  }
}

module.exports = TicketRepository;
