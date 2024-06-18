const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: Number,
  purchaser: {
    type: String,
    ref: "users",
  },
});

//Función para autogenerar el código único
ticketSchema.pre("save", async function (next) {
  const ticket = this;
  if (!ticket.isModified("code")) {
    return next();
  }
  //Genero el código único
  while (true) {
    ticket.code = crypto.randomBytes(8).toString("hex");
    const existTicket = await mongoose.models.Ticket.findOne({
      code: ticket.code,
    });
    //Verifico si ese código ya existe
    if (!existTicket) {
      break;
    }
  }
  next();
});

const TicketModel = mongoose.model("orders", ticketSchema);

module.exports = TicketModel;
