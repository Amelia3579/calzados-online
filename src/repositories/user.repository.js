const UserModel = require("../models/user.model.js");
const mongoose = require("mongoose");

class UserRepository {
  //Método para verificar si el user ya existe en la base de datos
  async findOne(dataBody) {
    try {
      return await UserModel.findOne(dataBody);
    } catch (error) {
      console.error(`Error searching for user: ${error.message}`);
      throw new Error("Error searching for user.");
    }
  }

  // Método para verificar si el usuario está autenticado
  async findById(dataUser) {
    try {
      return await UserModel.findById(dataUser).lean();
    } catch (error) {
      console.error(`Error verifying authentication: ${error.message}`);
      throw new Error("Error verifying authentication.");
    }
  }

  //Método para crear usuario
  async addUser(dataUser) {
    try {
      const newUserR = new UserModel(dataUser);

      return await newUserR.save();
    } catch (error) {
      console.error(`Error creating user: ${error.message}`);
      throw new Error("Error creating user");
    }
  }

  //Método para buscar y actualizar rol del usuario
  async findByIdAndUpdate(uid, updateData) {
    try {
      return await UserModel.findByIdAndUpdate(uid, updateData, { new: true });
    } catch (error) {
      console.error(`Error updating role: ${error.message}`);
      throw new Error("Error updating role");
    }
  }
}

module.exports = UserRepository;
