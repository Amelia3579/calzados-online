const UserModel = require("../models/user.model.js");
const mongoose = require("mongoose");

class UserRepository {
  //Método para verificar si el user ya existe en la base de datos
  async findOne(dataBody) {
    try {
      return await UserModel.findOne(dataBody);
    } catch (error) {
      throw new Error("Error al buscar el usuario.");
    }
  }

  // Método para verificar si el usuario está autenticado
  async findById(dataUser) {
    try {
      return await UserModel.findById(dataUser).lean();
    } catch (error) {
      throw new Error("Error en la verificación del usuario.");
    }
  }

  //Método para crear usuario
  async addUser(dataUser) {
    try {
      const newUserR = new UserModel(dataUser);

      return await newUserR.save();
    } catch (error) {
      throw new Error("Error al crear el usuario");
    }
  }
}

module.exports = UserRepository;
