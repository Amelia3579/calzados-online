const MessageModel = require("../models/message.model.js");
const mongoose = require("mongoose");

class ChatManager {
  //Método para mostrar chat.handlebars
  getChat(req, res) {
    try {
      res.render("chat");
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
}

module.exports = ChatManager;
