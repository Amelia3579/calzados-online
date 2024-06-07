const mongoose = require("mongoose");
const { schema } = require("./cart.model");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
    index: true, //es index porque tengo que consultar el usuario por el email y así encontrar más rápido los datos
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },
  age: {
    type: Number,
    // required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    enum: ["Admin", "Usuario"],
    default: "usuario"
  }
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
