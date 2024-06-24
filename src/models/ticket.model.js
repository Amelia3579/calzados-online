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

// Genero el código único antes de guardar
ticketSchema.pre("save", async function (next) {
  if (!this.isModified("code")) {
    return next();
  }

  try {
    const uniqueCode = await generateUniqueCode();
    this.code = uniqueCode;
    next();
  } catch (error) {
    next(error);
  }
});
const TicketModel = mongoose.model("tickets", ticketSchema);

module.exports = TicketModel;
