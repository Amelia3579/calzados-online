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
    type: String,
    default: "Admin",
    required: true,
  },
});

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("products", productSchema);

module.exports = ProductModel;
