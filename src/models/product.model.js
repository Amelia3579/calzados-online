const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const UserModel = require("../models/user.model.js");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },

  description: { type: String, required: true },

  price: { type: Number, required: true },

  thumbnail: { type: [String] },

  code: { type: String, unique: true, required: true },

  stock: { type: Number, required: true },

  img: { type: String },

  category: { type: String, required: true },

  status: { type: Boolean, required: true },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null, //Lo establezco en null para asignarle el rol admin, en caso de que el campo owner no esté especificado
  },
});

//------Lógica para rol premium (3° Práctica Integradora)------
//Middleware para manejar el campo owner
productSchema.pre("save", async function (next) {
  if (!this.owner) {
    // Busco al usuario admin
    const adminUser = await UserModel.findOne({ role: "admin" });

    if (adminUser) {
      // Asigno el _id del usuario admin al campo owner
      this.owner = adminUser._id;
    }
  }

  //Verifico si el producto es nuevo
  if (this.isNew) {
    //Si tiene un owner asignado, lo busca en la base de datos
    if (this.owner) {
      const user = await UserModel.findById(this.owner);

      //Validación para chequear que exista el usuario y de existir, que sea premium
      if (!user || user.role !== "premium") {
        return next(
          new Error(
            "Sólo usuarios premium pueden crear productos en la tienda."
          )
        );
      }
    }
  }

  next();
});
productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("products", productSchema);

module.exports = ProductModel;
