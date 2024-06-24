const crypto = require("crypto");
const TicketModel = require("../models/ticket.model.js");

// Función para calcular el precio total de la compra
const totalPurchase = (products) => {
  if (!Array.isArray(products)) {
    throw new TypeError("Error al intentar obtener los productos.");
  }
  let total = 0;

  products.forEach((elem) => {
    total += elem.product.price * elem.quantity;
  });
  return total;
};

//Función para autogenerar el código único
const generateUniqueCode = async function () {
  let code;
  while (true) {
    code = crypto.randomBytes(8).toString("hex");
    const existTicket = await TicketModel.findOne({ code: code });
    if (!existTicket) {
      break;
    }
  }
  return code;
};

module.exports = { totalPurchase, generateUniqueCode };
