const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const mongoose = require("mongoose");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");

class UserManager {
  //Método para registrar usuario
  async registerUser(req, res) {
    const { first_name, last_name, email, password, age } = req.body;

    try {
      //Verifico si el user ya existe
      const existUser = await UserModel.findOne({ email: email });

      if (existUser) {
        console.log("El usuario ingresado ya existe.");
        return res.render("profile");
      }

      //Si no existe, creo un usuario nuevo, al cual se asociará un nuevo carrito
      let newCart = await CartModel.create({ products: [] });

      //Defino el rol de usuario y admin
      const role = email === "adminapp@gmail.com" ? "admin" : "usuario";

      const newUser = new UserModel({
        first_name,
        last_name,
        email,
        password: createHash(password),
        age,
        role,
        //Al nuevo usuario, vinculo el id del carrito nuevo
        cart: newCart._id,
      });

      //Lo guardo en la base de datos
      await newUser.save();

      //Genero el token
      const token = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
        },
        "secretWord",
        { expiresIn: "1h" }
      );

      //Establezco el token como cookie en el servidor
      res.cookie("cookieToken", token, {
        //Configuro 1 hora de vida para el token
        maxAge: 3600000,
        //Restrinjo el acceso a una petición http
        httpOnly: true,
      });

      //Cuando termine la operación de registro, se redirige a profile
      res.redirect("/api/sessions/profile");
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
}

module.exports = UserManager;
