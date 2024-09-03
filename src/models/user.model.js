const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    index: true, //es index porque tengo que consultar el usuario por el email y así encontrar más rápido los datos
    unique: true,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    enum: ["Admin", "User", "Premium"], //Enumero las opciones válidas
    default: "User",
  },
  //Campo para guardar token generado
  resetToken: {
    token: String,
    expire: Date,
  },
  //4° práctica integradora (guardará la documentación del user que quiere ser premium)
  documents: [
    {
      name: String,
      reference: String,
    },
  ],
  last_connection: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
